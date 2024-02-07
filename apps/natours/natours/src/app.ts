import express from 'express';

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

const App = express();

App.disable('x-powered-by');

/**
 * ## GET SECURE COOKIES FROM PROXIES
 */
// App.enable('trust proxy');
// App.set('trust proxy', 1); // trust first proxy

/**
 * ## IMP: this line will forward info from the load balancer / proxy to the App
 * things like https cookies (nginx to node is http). also the IP address is the nginx IP address
 */
if (IS_PROXY_ENABLED) App.set('trust proxy', NUMBERS_OF_PROXIES);

/**
 * ## set views path to root dir to solve relative path problems?
 */
// TODO: refactor for tsc
App.set('views', './'); // requires webpack copying the views folder to dist
App.set('view engine', 'pug');

/**
 * ## Global middleware
 */
await handleGlobalMiddleware(App);

// TODO: debugging global middleware, remove

/**
 * ## ROUTES
 */

/**
 * ## STRIPE WEBHOOK
 * after middleware, before routes
 * MUST BE BEFORE JSON BODY PARSER or SET req.rawBody
 */
App.post('/webhook-checkout', webhookCheckout);

// generic router for pug templates, static, folders etc
App.use('/', viewsRouter);

// static
// ! serving the public folder static files, need to copy it as it's path relative
// TODO: refactor for tsc
App.use('/', staticsRouter);

// ROUTES

App.use('/api/v1/tours', toursRouterV1);

App.use('/api/v1/users', usersRouterV1); // this becomes the / in usersRouterV1

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
 * contains:
 * - unsupportedMethodRouter
 * - pageNotFoundController
 * - Sentry error handler
 * - globalErrorController
 */
// ! jonas error handling post refactor
App.use(
  '*',
  /**
   * ## moved this inside the errosRouter
   */
  // unsupportedMethodRouter, // handle bad methods before unsupported handle
  // (
  //   req: express.Request,
  //   _res: express.Response,
  //   next: express.NextFunction
  // ) => {
  //   next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
  // }
  errorsRouter,
  globalErrorController // we need to put it here, won't work inside a router
);

export { App };
