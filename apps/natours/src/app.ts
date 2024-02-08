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

const x = 3;

async function createApp() {
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
  App.set('views', '../views'); // requires webpack copying the views folder to dist

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
