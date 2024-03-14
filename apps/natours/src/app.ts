/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import express, { json } from 'express';

import { IS_PROXY_ENABLED, NUMBERS_OF_PROXIES } from './config';
import { globalErrorController, webhookCheckout } from './controllers';
import { handleGlobalMiddleware } from './middleware';
import {
  bookingsRouterV1,
  errorsRouter,
  prismaRouterV1,
  reviewRouterV1,
  staticsRouter,
  toursRouterV1,
  usersRouterV1,
  viewsRouter,
} from './routes';

async function createApp() {
  const App = express();

  // prevent fingerprinting
  App.disable('x-powered-by');

  /**
   * ## GET SECURE COOKIES FROM PROXIES if behind a proxy
   * ## this line will forward info from the load balancer / proxy to the App
   * things like https cookies (nginx to node is http). also the IP address is the nginx IP address
   */
  if (IS_PROXY_ENABLED) App.set('trust proxy', NUMBERS_OF_PROXIES);

  /**
   * ## STRIPE WEBHOOK
   * after middleware, before routes, requires raw body
   * MUST BE BEFORE JSON BODY PARSER or SET req.rawBody
   * check global middleware
   */
  App.post(
    '/webhook-checkout',
    json({
      limit: '10kb',
      verify: (req, _, buf) => {
        req.rawBody = buf;
      },
    }),
    webhookCheckout
  );

  /**
   * ## Global middleware
   */
  await handleGlobalMiddleware(App);

  /**
   * ## VIEWS
   */
  App.set('views', '../views');
  App.set('view engine', 'pug');
  // TODO: refactor for tsc
  App.use('/', viewsRouter);

  /**
   * ## STATIC FILES
   */
  // ! serving the public folder static files, need to copy it as it's path relative
  // TODO: refactor for tsc
  App.use('/', staticsRouter);

  // TODO: redis sessions, oauth, better frontend (astro,react,svelte?)

  /**
   * ## API
   */

  App.get('/healthz', (_req, res) => {
    res.status(200).json({
      status: 'success',
      uptime: process.uptime(),
    });
  });

  App.use('/api/v1/tours', toursRouterV1);

  App.use('/api/v1/users', usersRouterV1);

  App.use('/api/v1/reviews', reviewRouterV1);

  App.use('/api/v1/bookings', bookingsRouterV1);

  // test with prisma
  App.use('/api/v1/prisma', prismaRouterV1);

  /**
   * ## sentry
   */
  // The error handler must be before any other error middleware and after all controllers
  // if (IS_SENTRY_ENABLED) {
  //   App.use(Sentry.Handlers.errorHandler());
  // }

  /**
   * ## Error handling
   * - unsupportedMethodRouter
   * contains:
   * - pageNotFoundController
   * - Sentry error handler
   * - globalErrorController
   */
  App.use('*', errorsRouter, globalErrorController);

  return App;
}

export { createApp };
