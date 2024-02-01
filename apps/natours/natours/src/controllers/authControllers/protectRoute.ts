import type { NextFunction, Request, Response } from 'express';

import { WORKER_POOL_ENABLED } from '../../config';
import { AppError, catchAsync, statusCodes, verifyToken } from '../../helpers';
import { User } from '../../models';
import { poolProxy } from '../../workers';

/**
 * Protect route function: require Auth header, valid and not expired token, user exists, user no change password.
 * Error handled by globalError controller
 *
 * @async
 * @param req - req
 * @param _res - res
 * @param next - next
 */
export const protectRoute = catchAsync(async function checkIfLoggedIn(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  // IMP: steps 1: get token and check if it's there
  // JONAS WAY
  let token: string | undefined;

  /**
   * ## allow setting both header and cookie for study purposes, but keep both for this course
   */
  // if (req.headers.authorization && req.cookies.jwt) {
  //     return next(
  //         new AppError(
  //             'Please use either header or cookie for authentication',
  //             400
  //         )
  //     );
  // }
  if (req.cookies.jwt && req.headers.authorization) {
    return next(
      new AppError(
        'You are using conflicting authentication methods. Please use either header or cookie for authentication',
        statusCodes.badRequest
      )
    );
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ').at(1);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError(
        'You are not logged in. Please login to get access',
        statusCodes.unauthorized
      )
    );

  /**
   * ## IMP: steps 2: verification ( validity + expiry)
   */

  // verify validity and return payload: check if token has been tampered with ( the verifyToken function will throw error in that case )
  // const decodedPayload = await verifyToken(token);
  const decodedPayload = await (WORKER_POOL_ENABLED === '1'
    ? poolProxy.verifyTokenWorker(token)
    : verifyToken(token));

  // we handle the code in the global error handler: not here
  // if (decodedPayload.message) {
  //     const errorMessage =
  //         decodedPayload.message === 'jwt expired'
  //             ? 'Session expired, please login again.'
  //             : 'Something went wrong. Please login or signup';

  //     return next(new AppError(errorMessage, 401));
  // }

  // verify expiration
  // exp and iat are in seconds
  // if (decodedPayload.exp! * 1000 <= Date.now())
  //     return next(
  //         new AppError(
  //             'Login session expired. Please login again to get access',
  //             401
  //         )
  //     );

  // IMP: step 3: verify user existance
  const freshUser = await User.findById(decodedPayload.id).select(
    '+role +password'
  );

  if (!freshUser)
    return next(
      new AppError(
        'The user belonging to this token does no longer exists. Please login or signup.',
        401
      )
    );

  // IMP: step 4: verify if user change password aftert JWT issuance
  /**
   * NOTE: this step will make a db call on every request to the protected apis.
   * this invalidates the usefulness and meaning of JWT = avoid making a DB call on every request
   * the correct way to implement this would be: access and refresh token (on the access check, don't make a db call) with
   * refresh rotation and reuse detection [https://www.youtube.com/watch?v=s-4k5TcGKHg&t=757s]
   */
  if (freshUser.hasPasswordChangedSinceTokenIssuance(decodedPayload.iat))
    return next(
      new AppError('This token is no longer valid. Please login again', 401)
    );

  // TODO: mutation here?
  // NOTE: possible breaking change _doc
  // if not expired, move on ( add ID in body? )
  // req.user = structuredClone(freshUser._doc);
  // eslint-disable-next-line require-atomic-updates, no-underscore-dangle
  // req.user = freshUser._doc;
  // eslint-disable-next-line require-atomic-updates, no-underscore-dangle
  req.user = freshUser;
  // eslint-disable-next-line no-param-reassign
  _res.locals.user = freshUser;

  next();
});
