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

  /**
   * ## API
   */

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
  // ! jonas handling unhandled routs - pre refactor
  // App.all(
  //     '*',
  //     (
  //         req: express.Request,
  //         _res: express.Response,
  //         next: express.NextFunction
  //     ) => {
  //         //     res.status(404).json({
  //         //         status: 'fail',
  //         //         message: `can't find ${req.originalUrl} on this server`,
  //         //     });

  //         // ! with global error handler
  //         // const err: any = new Error(
  //         //     `can't find ${req.originalUrl} on this server!`
  //         // ); // this will be the messazge
  //         // err.status = 'fail';
  //         // err.statusCode = 404;

  //         // const err = new AppError(
  //         //     `can't find ${req.originalUrl} on this server!`,
  //         //     404
  //         // );
  //         // next(err)

  //         // pass the error to error middleware directly
  //         next(
  //             new AppError(`can't find ${req.originalUrl} on this server!`, 404)
  //         );
  //     }
  // );

  // ! error handling middleware
  // ( this is the global express error handler )
  // expecption = operational error
  // by providing 4 params to the middleware, we tell express this is an error handler
  // App.use((err: any, _req: any, res: any, _next: any) => {
  //     // ! bad, don't spread the err object ( doesn't have OwnProperty message ) message will be undefined
  //     // destructure and assign
  //     // console.log(err);
  //     // console.log(err.message);
  //     // if (err) Logger.error(err.stack);
  //     // const error = { ...err };
  //     // console.log(error);
  //     // console.log(error.message); // why undefined if the err.message is correct?

  //     // error.statusCode ??= 500; // define default status code when we don't specify or are created in other places
  //     // error.status ??= 'error'; // default status message to send if not present
  //     // error.message ??= 'internal server error'; // default status message to send if not present

  //     // does it work with destructuring and defaults?
  //     const {
  //         statusCode = 500,
  //         status = 'error',
  //         message = 'internal server error',
  //     } = err;
  //     // we will define the status code on the error
  //     res.status(statusCode).json({
  //         status,
  //         message,
  //     });
  // });

  // ! old handle 500 404 errors, pre error handling lesson
  // ! handle 404
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // App.use((_req, res, _next) => {
  //     res.status(404).send(`error: 404 not found ${_req.path}`);
  // });
  // App.use((err: any, _req: any, res: any, _next: any) => {
  //     if (err) Logger.error(err.stack);
  //     res.status(500).send('error: 500 internal server error');
  // });
  return App;
}

export { createApp };
