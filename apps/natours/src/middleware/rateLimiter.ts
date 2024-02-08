import type { NextFunction, Request, Response } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import { RATE_LIMITER_DURATION, RATE_LIMITER_POINTS } from '../config';
import { redisConnection } from '../database/redis/redis';
import { AppError, catchAsync, statusCodes } from '../helpers';
// import { Logger } from '../loggers';

const options = {
  // Basic options
  storeClient: redisConnection,
  points: RATE_LIMITER_POINTS, // Number of points
  duration: RATE_LIMITER_DURATION, // Per second(s)
  keyPrefix: 'rateLimiter',

  // Custom
  execEvenly: false, // Do not delay actions evenly
  // blockDuration: 0, // Do not block if consumed more than points
};

const rateLimiterRedis = new RateLimiterRedis(options);

const rateLimiterMiddleware = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.ip) {
        return next();
      }
      await rateLimiterRedis.consume(req.ip);
      return next();
    } catch {
      return next(
        new AppError(
          'Too Many Requests, try again in one hour!',
          statusCodes.tooManyRequests
        )
      );
    }
  }
);

export { rateLimiterMiddleware };
