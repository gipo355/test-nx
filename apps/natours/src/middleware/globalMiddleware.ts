import * as Sentry from '@sentry/node';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { type Express, json, urlencoded } from 'express';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import xssSanitize from 'xss-clean';

import {
  API_RATE_LIMITER_ENABLED,
  COMPRESSION_ENABLED,
  GLOBAL_RATE_LIMITER_ENABLED,
  IS_EXPRESS_STATUS_MONITORING_ON,
  IS_SENTRY_ENABLED,
} from '../config';
// eslint-disable-next-line node/no-unpublished-import
// import { protectRoute, restrictTo } from '../controllers';
import { Logger, morganLogger } from '../loggers';

// eslint-disable-next-line unicorn/prefer-module

export const handleGlobalMiddleware = async function middleware(App: Express) {
  /**
   * ## Helmet
   */
  App.use(helmet());
  /**
   * ## Resolve Content security policy issues
   */
  // overriding "font-src" and "style-src" while
  // maintaining the other default values
  App.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        // 'font-src': ["'self'", 'external-website.com'],
        // allowing styles from any website
        // 'style-src': null,
        'img-src': [
          "'self'",
          'data:',
          // `https://`,
          // 'https://ik.imagekit.io',
          'https://ik.imagekit.io/',
        ],
        'script-src': [
          "'self'",
          'https://*.mapbox.com',
          'https://js.stripe.com/v3/',

          'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js',
          'https://cdnjs.cloudflare.com/ajax/libs/mapbox-gl/2.15.0/mapbox-gl.js',
          'api.mapbox.com',
        ],
        'worker-src': ['blob:'],
        'connect-src': ["'self'", '*.mapbox.com', 'checkout.stripe.com'],
        'frame-src': ['https://js.stripe.com/v3/'],
      },
    })
  );
  // Set Content Security Policies
  // const scriptSources = ["'self'", "'unsafe-inline'", "'unsafe-eval'"];
  // const scriptSources = ["'self'", '*.mapbox.com', 'blob:*'];
  // const styleSources = ["'self'", "'unsafe-inline'"];
  // const styleSources = ["'self'", "'unsafe-inline'", '*.mapbox.com'];
  // const connectSources = ["'self'"];
  // App.use(
  //   helmet.contentSecurityPolicy({
  //     defaultSrc: ["'self'"],
  //     scriptSrc: scriptSources,
  //     scriptSrcElem: scriptSources,
  //     styleSrc: styleSources,
  //     connectSrc: connectSources,
  //     reportUri: '/report-violation',
  //     reportOnly: false,
  //     safari5: false,
  //   })
  // );
  // App.use(
  //   helmet({
  //     contentSecurityPolicy: false,
  //   })
  // );
  // App.use(
  //   helmet({
  //     contentSecurityPolicy: {
  //       directives: {
  //         defaultSrc: ["'self'"],
  //         styleSrc: styleSources,
  //         scriptSrc: scriptSources,
  //         // connectSources,
  //       },
  //     },
  //   })
  // );

  /**
   * ## SENTRY
   */
  if (IS_SENTRY_ENABLED) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    Sentry.init({
      dsn: process.env.NATOUR_SENTRY_DSN,
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app: App }),
        // Automatically instrument Node.js libraries and frameworks
        ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
      ],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1,
    });
    // RequestHandler creates a separate execution context, so that all
    // transactions/spans/breadcrumbs are isolated across requests
    App.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    App.use(Sentry.Handlers.tracingHandler());
  }

  /**
   * ## rate limiter
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (GLOBAL_RATE_LIMITER_ENABLED) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { rateLimiterMiddleware } = await import('./rateLimiter');
    App.use(rateLimiterMiddleware);
    Logger.info('GLOBAL_RATE_LIMITER_ENABLED with redis');
  }
  if (API_RATE_LIMITER_ENABLED) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { rateLimiterMiddleware } = await import('./rateLimiter');
    App.use('/api', rateLimiterMiddleware);
    Logger.info('API_RATE_LIMITER_ENABLED with redis');
  }

  /**
   * ## Appending other security headers
   */
  // App.use((_req, res, next) => {
  //   res.append('Access-Control-Allow-Origin', ['*']); // this is set by CORS
  //   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   res.append('Access-Control-Allow-Headers', 'Content-Type');
  //   next();
  // });

  /**
   * ## CORS
   * no idea what this does... it sets the header Access-Control-Allow-Origin=*
   * allows external apps to access our api
   * can be route specific or global
   */
  App.use(
    // for all routes
    cors()
    // cors({
    //   origin: 'http://example.com', // allow only a specific origin to query routes
    //   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    // })
  );

  /**
   * ## Send response to OPTIONS request for preflight CORS request
   * on all routes
   */
  App.options('*', cors());
  // App.options('/api/v1/tours/:id', cors()); // only for this route

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (IS_EXPRESS_STATUS_MONITORING_ON) {
    // TODO: permissions for statusMonitor

    // eslint-disable-next-line global-require, unicorn/prefer-module
    const statusMonitor = require('express-status-monitor')();
    App.use(statusMonitor);
    App.get(
      '/status',
      // protectRoute,
      // restrictTo('admin'),
      statusMonitor.pageRoute
    );
    Logger.info('status monitor on /status');
  }

  App.use(morganLogger);

  App.use(
    urlencoded({
      extended: true,
      /**
       * ## prevent parameter pollution
       */
      limit: '10kb',
    })
  );

  const { COOKIE_PARSER_SECRET } = process.env;

  App.use(cookieParser(COOKIE_PARSER_SECRET)); // need secret to create signed cookies

  /**
   * ## STRIPE WEBHOOK
   * after middleware, before routes
   * MUST BE BEFORE JSON BODY PARSER or SET req.rawBody
   * DOESN'T WORK HERE
   */
  // App.use(
  //     '/webhook-checkout',
  //     express.raw({
  //         type: 'application/json',
  //     }),
  //     webhookCheckout
  // );

  /**
   * ## Store raw json in req.rawBody for stripe webhooks only
   * for stripe webhooks only
   *
   * MOVED THE MIDDLEWARE IN APP.TS BEFORE GLOBALS
   */
  App.use(
    '/webhook-checkout',
    // limit the size of the body to prevent payload attacks
    json({
      limit: '10kb',
      verify: (req, _, buf) => {
        req.rawBody = buf;
      },
    })
  );

  /**
   * ## Json payload into body
   */
  App.use(
    // limit the size of the body to prevent payload attacks
    json({
      limit: '10kb',
    })
  );

  // SANITIZATION: put after body parser and json
  App.use(
    ExpressMongoSanitize({
      onSanitize: (object: any) => {
        // console.warn(`This request${object} is sanitized`, object);
        // Logger.warn(req);
        // Logger.warn(`a ${object.key} has been sanitized`);
        const logObject = {
          message: `Sanitized a ${object.key} with express-mongo-sanitize`,
          originalUrl: object.req.originalUrl,
          // eslint-disable-next-line no-underscore-dangle
          startTime: object.req._startTime,
          // eslint-disable-next-line no-underscore-dangle
          remoteAddress: object.req._remoteAddress,
          query: object.req.query,
          data: object,
        };
        // Logger.warn(object.req);
        Logger.warn(logObject);
      },
    })
  );

  // xss sanitize for all body, after json() and body parser
  App.use(xssSanitize());

  // prevent parameter pollution with a whitelist
  // prevent multiple same query or body params
  App.use(
    hpp({
      whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price',
      ],
    })
  );

  if (COMPRESSION_ENABLED) App.use(compression()); // prefer nginx compression over this if possible ( huge stress on event loop )

  // creating our own global middleware function
  // App.use((_req: any, _res: any, next: any) => {
  //
  // Logger.info('hello from the middleware');

  // ! IF WE DON'T CALL NEXT, THE REQ RES CYCLE GETS STUCK
  //     next();
  // });

  // ! another one to manipulate req object
  // this is how morgan works
  // adding a prop to the request using a middleware on all requests

  App.use((_req: any, _res: any, next: any) => {
    // eslint-disable-next-line no-param-reassign
    _req.requestTime = new Date().toISOString();
    next();
  });

  // for others check tours route ( specific middleware per route)
  // middleware can be used on use(), any method(e.g. get()) and can be path specific
};
// paths are cascading  (e.g. /api/tours will trigger /api/tours/id)
