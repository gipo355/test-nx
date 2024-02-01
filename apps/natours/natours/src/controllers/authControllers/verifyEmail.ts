import type { NextFunction, Request, Response } from 'express';

import {
  AppError,
  autoEasyEncrypt,
  catchAsync,
  createSendToken,
  statusCodes,
} from '../../helpers';
import { bullmqQueue1 } from '../../messageBrokers';
import { User } from '../../models';

/**
 * ## verifyEmail
 * @description verifies email
 * takes in query params with a token
 * verify token
 * query db for user with token = verifyToken
 * if found:
 *  - change user active to true
 *  - verified to true
 *  - remove expireAt
 *
 * send response for success
 */
const verifyEmail = catchAsync(
  //
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;

    // console.log('token', token);

    if (!token) {
      return next(new AppError('invalid token', statusCodes.badRequest));
    }

    const encryptedToken = await autoEasyEncrypt(token);

    // console.log('encryptedToken', encryptedToken);

    /**
     * ## We need to search in the active: false users
     */
    const user = await User.findOne({
      verified: false,
      verifyToken: encryptedToken,
      expireAt: { $gt: Date.now() },
    });

    // console.log(user);

    if (!user) {
      return next(new AppError('invalid token', statusCodes.badRequest));
    }

    user.verified = true;
    user.verifyToken = undefined;
    user.expireAt = undefined;

    await user.save({ validateBeforeSave: false });

    const jwtPayload = {
      id: user.id,
    };

    await bullmqQueue1.add('sendWelcomeEmail', {
      type: 'sendWelcome',
      data: {
        user,
        /**
         * ## TODO: we must provide a logged in URL to click on
         *
         * maybe nod needed if user is already logged in from same browser? cookies are set. what if 2 browsers?
         */
        url: `${req.protocol}://${req.get('host')}/me`,
      },
    });

    void createSendToken({
      res,
      payload: jwtPayload,
      realMessage: 'email verified',
    });
  }
);
export { verifyEmail };
