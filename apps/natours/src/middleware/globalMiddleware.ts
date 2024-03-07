/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import * as Sentry from '@sentry/node';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { type Express, json, urlencoded } from 'express';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet, { contentSecurityPolicy } from 'helmet';
import hpp from 'hpp';

// import xssSanitize from 'xss-clean';
import {
  API_RATE_LIMITER_ENABLED,
  COMPRESSION_ENABLED,
  GLOBAL_RATE_LIMITER_ENABLED,
  IS_SENTRY_ENABLED,
} from '../config';
import { SECRETS } from '../environment.js';
import { Logger, morganLogger } from '../loggers';

export const handleGlobalMiddleware = async function middleware(App: Express) {
  /**
   * ## Helmet
   */
  App.use(helmet());

  /**
   * ## Resolve Content security policy issues
   * overriding "font-src" and "style-src" while
   * maintaining the other default values
   */

  App.use(
    contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'img-src': ["'self'", 'data:', 'https://ik.imagekit.io/'],
        'script-src': [
          "'strict-dynamic'",
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

  /**
   * ## SENTRY
   */
  if (IS_SENTRY_ENABLED) {
    Sentry.init({
      dsn: SECRETS.NATOUR_SENTRY_DSN,
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

    Logger.info('🤖 Sentry enabled');
  }

  /**
   * ## rate limiter
   */
  if (GLOBAL_RATE_LIMITER_ENABLED) {
    const { rateLimiterMiddleware } = await import('./rateLimiter.js');
    App.use(rateLimiterMiddleware);
    Logger.info('🧱 GLOBAL_RATE_LIMITER_ENABLED with redis');
  }
  if (API_RATE_LIMITER_ENABLED) {
    const { rateLimiterMiddleware } = await import('./rateLimiter.js');
    App.use('/api', rateLimiterMiddleware);
    Logger.info('🧱 API_RATE_LIMITER_ENABLED with redis');
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
   */
  App.use(
    // for all routes
    cors()
    // cors({
    //   origin: 'http://example.com', // allow only a specific origin to query routes
    //   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    // })
  );
  Logger.info('🔒 CORS enabled globally');

  /**
   * ## Send response to OPTIONS request for preflight CORS request
   * on all routes
   */
  App.options('*', cors());
  // App.options('/api/v1/tours/:id', cors()); // only for this route

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

  App.use(cookieParser(COOKIE_PARSER_SECRET));

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
      onSanitize: (object) => {
        const logObject = {
          message: `Sanitized a ${object.key} with express-mongo-sanitize`,
          originalUrl: object.req.originalUrl,
          // remoteAddress: object.req._remoteAddress,
          query: object.req.query,
          data: object,
        };
        Logger.warn(logObject);
      },
    })
  );

  // xss sanitize for all body, after json() and body parser
  // TODO: deprecated
  // App.use(xssSanitize());

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
