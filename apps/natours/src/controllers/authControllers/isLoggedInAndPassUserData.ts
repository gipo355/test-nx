import type { NextFunction, Request, Response } from 'express';

import { autoVerifyToken } from '../../helpers';
import { Logger } from '../../loggers';
import { User } from '../../models';

const isLoggedInAndPassUserData = async function isLoggedInAndPassUserData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /**
   * ## fixing the expected returned promise, an async function always returns a promise if not undefined. So we wrap it in a void
   * IIFE to avoid that.
   * WHy: Functionally, no. Semantically, yes — it signals clearly that this is a "fire and forget" operation and that the callback itself doesn't do
   * anything special with the asynchronous code (doesn't await it or do anything with the result).
   */
  // eslint-disable-next-line no-void
  // void (async () => {
  /**
   * ## In this route we can't use catchAsync because we need to continue even if there is an error or the page won't load
   * if we use catchAsync, the server will reply with JSON error
   */
  try {
    const { jwt } = req.cookies;
    if (!jwt) return next();

    /**
     * ## TODO: possible security flaw? timing attack?
     */
    const decodedPayload = await autoVerifyToken(jwt);
    if (!decodedPayload) return next();
    // console.log(decodedPayload, 'decodedPayload');

    /**
     * ## copied from protetRoute.ts
     * some differences: protectRoute responds with badRequest if token is not present, but this middleware does not
     */
    // IMP: step 3: verify user existance
    const freshUser = await User.findById(decodedPayload.id).select(
      '+role +password'
    );
    if (!freshUser) return next();
    // new AppError(
    //   'The user belonging to this token does no longer exists. Please login or signup.',
    //   401
    // )

    // IMP: step 4: verify if user change password aftert JWT issuance
    /**
     * NOTE: this step will make a db call on every request to the protected apis.
     * this invalidates the usefulness and meaning of JWT = avoid making a DB call on every request
     * the correct way to implement this would be: access and refresh token (on the access check, don't make a db call) with
     * refresh rotation and reuse detection [https://www.youtube.com/watch?v=s-4k5TcGKHg&t=757s]
     */
    if (freshUser.hasPasswordChangedSinceTokenIssuance(decodedPayload.iat))
      return next();
    // new AppError('This token is no longer valid. Please login again', 401)

    // TODO: mutation here?
    // NOTE: possible breaking change _doc
    // if not expired, move on ( add ID in body? )
    // req.user = structuredClone(freshUser._doc);
    // eslint-disable-next-line require-atomic-updates, no-underscore-dangle
    // req.user = freshUser._doc;

    /**
     * ## ses.locals will give access to all pug templates
     */
    // eslint-disable-next-line require-atomic-updates, no-underscore-dangle
    res.locals.user = freshUser;
    // req.user = freshUser;

    return next();
  } catch (error) {
    Logger.error(`Error in isLoggedInAndPassUserData: ${error}`);
    return next();
  }
  // })();
  // return next();
};

export { isLoggedInAndPassUserData };
