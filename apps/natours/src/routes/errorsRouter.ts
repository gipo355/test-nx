import * as Sentry from '@sentry/node';
// import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';

import { IS_SENTRY_ENABLED } from '../config';
import {
  pageNotFoundController,
  unsupportedMethodHandler,
} from '../controllers';
import { Logger } from '../loggers';
// import { AppError } from '../helpers';

const router = Router();

/**
 * ## catch unsupported methods
 */
router.route('*').put(unsupportedMethodHandler);

/**
 * ## catch page not found 404
 */
// router.use('*', (req: Request, _res: Response, next: NextFunction) => {
//   next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
// });
router.use('*', pageNotFoundController);

/**
 * ## sentry
 */
// The error handler must be before any other error middleware and after all controllers
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (IS_SENTRY_ENABLED) {
  router.use(Sentry.Handlers.errorHandler());
  Logger.info('Sentry enabled');
}

/**
 * ## Error handling
 * Global error handler, gets passed the error object from all previous middlewares after every route is checked
 */
// router.use(globalErrorController);
// router.use('*', globalErrorController);
export { router as errorsRouter };
