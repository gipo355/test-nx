import type { NextFunction, Request, Response } from 'express';

import { CURRENT_API_VERSION } from '../../config';
import { AppError, catchAsync } from '../../helpers';
import { Logger } from '../../loggers';
import { bullmqQueue1 } from '../../messageBrokers';
import { User } from '../../models';

/**
 * @openapi
 * /users/forgot-password:
 *  post:
 *   summary: sends email with token
 *
 *   consumes:
 *    - application/json
 *
 *   tags:
 *    - users
 *
 *   description: sends email with reset token
 *
 *   responses:
 *    200:
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          example: success
 *         message:
 *          type: string
 *          example: message sent
 *
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *       required:
 *        - email
 *
 */
export const forgotPassword = catchAsync(async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //
  // NOTE: step 1: get user based on posted email
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError('invalid email', 404));

  // NOTE: step 2: generate random reset token to send and save the encrypted token in mongodb ( also trigger password update date to invalidate JWTs)
  const randomToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // if (randomToken.err)
  //     return next(new AppError('There was an error: please try again', 404));

  // 3 places where we could the below code + encryption (encrypt + save to db): pre hook, instance method, here

  // to trigger pre save hook we need to save the document ( the pre hook will encrypt and store the token )
  // user.set({ passwordResetToken: randomToken });
  // we save in the schema method
  // await user.save({ validateBeforeSave: false }); // IMP: we need validateBeforeSave because otherwise it asks to insert all required fields

  // NOTE: step 3: send it to user email
  // await sendEmail({
  //     to: user.email,
  //     subject: 'Password Reset',
  //     message: `You have requested a password reset. Rest token: ${randomToken}`,
  // });

  // build the reset URL which will redirect to the reset rute
  // const resetURL = `${HTTP_PROTOCOL}://${`${NATOUR_HOST}:${NATOUR_PORT}`}/users/resetpassword/${randomToken}`;
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/${CURRENT_API_VERSION}/users/reset-password/${randomToken}`;

  // console.log(resetURL, 'reset url in forgotPassword');

  // IMP: we need good error handling. if email is not added to que or not sent, must revert back pw and pw reset expire
  try {
    // will bullmq, send job to que. can be processed by either workerpool worker or standard bullmq worker
    // await bullmqQueue1.add(
    //     // 'passwordResetEmail', // job name
    //     'passwordResetEmail', // job name
    //     {
    //         type: 'old',
    //         data: {
    //             old: {
    //                 subject: 'Password Reset Token (valid for 5 minutes)',
    //                 to: user.email,
    //                 message: `Forgot password? Send a PATCH request with new password and passwordConfirm to the reset URL. Reset URL: ${resetURL}\n If you didn't forget your password, please contact support`,
    //                 // eslint-disable-next-line no-underscore-dangle
    //                 id: user.id,
    //             },
    //         },
    //     }
    //     // { removeOnComplete: 500, removeOnFail: 2500 } // set as default in the que
    // );
    await bullmqQueue1.add('passwordResetEmail', {
      type: 'sendPasswordReset',
      data: {
        user,
        url: resetURL,
      },
    });
  } catch (error) {
    /**
     * ## Error Handling
     * we need to make it unique because we want to clear the reset token if something goes wrong
     */
    Logger.error(error);
    // user.passwordResetToken = undefined;
    // user.passwordResetExpiry = undefined;
    await user.clearPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    return next(new AppError('there was an error, please try again', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'token sent to email!',
  });
});
