import type { NextFunction, Request, Response } from 'express';

import { WORKER_POOL_ENABLED } from '../../config';
import {
  AppError,
  catchAsync,
  createSendToken,
  easyEncrypt,
  statusCodes,
} from '../../helpers';
import { User } from '../../models';
import { poolProxy } from '../../workers';
// import { signToken } from './signToken';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * @openapi
 * /users/reset-password/{resetToken}:
 *  patch:
 *   summary: reset password with valid reset token
 *
 *   consumes:
 *    - application/json
 *
 *   tags:
 *    - users
 *
 *   description: reset password with a valid token
 *
 *   responses:
 *    200:
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/TokenGenerated'
 *
 *   parameters:
 *    - in: path
 *      name: resetToken
 *      description: the reset token provided via email by forgot password route
 *      schema:
 *       type: string
 *      required: true
 *
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        password:
 *         type: string
 *        passwordConfirm:
 *         type: string
 *       required:
 *        - password
 *        - passwordConfirm
 *
 */

/**
 * reset password controller function.
 * @remarks
 * ASYNC
 * SIDE EFFECT: modifies user password, passwordLastModified, passwordResetExpiry, passwordResetToken
 * @param req - express request
 * @param res - express response
 * @param _next - express NextFunction
 * @returns void
 */
export const resetPassword = catchAsync(async function resetPassword(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // IMP: for performance reasons, we can try to avoid creating variables here. A must for readability and creating copies tho. Make sure there are no mutations occurring
  // Objects assigned are passed the reference
  // in this case, no need to destructure as we don't mutate

  // const { token: resetToken } = req.params;
  // const { password, passwordConfirm } = req.body;
  // console.log(req.body);

  // console.log(token, password, passwordConfirm);

  /**
   * ## 1: get user based on token
   */
  // encrypt original to compare in db
  const encryptedToken = await (WORKER_POOL_ENABLED === '1'
    ? poolProxy.easyEncryptWorker(req.params.token)
    : easyEncrypt(req.params.token));
  // const user = await User.findOne({ passwordResetToken: encryptedToken });
  // IMP: note compares dates right in the query
  const user = await User.findOne({
    passwordResetToken: encryptedToken,
    passwordResetExpiry: { $gt: Date.now() },
  });

  /**
   * ## 2: set new password from body only if token has not expired and there is a user
   */
  // const isTokenValid = user?.passwordResetExpiry >= Date.now();
  if (!user)
    return _next(new AppError('invalid token', statusCodes.badRequest));
  // if (!isTokenValid)
  //     return _next(
  //         new AppError(
  //             'token expired, please request another one',
  //             statusCodes.badRequest
  //         )
  //     );

  // console.log('ok');

  /**
   * ## 3: update passwordLastModified
   */
  // eslint-disable-next-line security/detect-possible-timing-attacks
  // if (password !== passwordConfirm)
  //     return new AppError(
  //         'Password and Confirmation Password must match!',
  //         statusCodes.badRequest
  //     );

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  // Jonas does this in the mongoose pre schema
  // user.passwordLastModified = new Date(
  //     Date.now() - LAST_MODIFIED_DELAY_MS
  // ).toISOString(); // NOTE: must remove 1000 or conflicts with the json web token expiry. (iat in seconds)
  await user.clearPasswordResetToken();
  // don't turn off the validators: we want to validate to confirm if pw = pwconfirm
  await user.save();

  /**
   * ## 4: login: send jwt
   */
  const tokenPayload = {
    // eslint-disable-next-line no-underscore-dangle
    id: user.id as string,
    // id: user._id.toString(),
  };

  // eslint-disable-next-line no-underscore-dangle
  // const token = await signToken(tokenPayload);

  // with worker pools
  // const token = await (WORKER_POOL_ENABLED === '1'
  //     ? poolProxy.signTokenWorker(tokenPayload)
  //     : signToken(tokenPayload));
  // const token = await autoSignToken(tokenPayload);

  // // alternatively send cookies ( set pre sending )
  // // ! IMP: CAREFUL, COOKIES ARE VULNERABLE TO CSRF ATTACKS
  // // _res.cookie('test-jwt', token, JWT_COOKIE_OPTIONS);

  // res.status(200).json({
  //     status: 'success',
  //     token,
  // });

  // eslint-disable-next-line no-void
  return createSendToken({
    payload: tokenPayload,
    res,
  });
});
