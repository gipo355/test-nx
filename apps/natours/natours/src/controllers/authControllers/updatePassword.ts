/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  AppError,
  areAllPasswordsValidAscii,
  catchAsync,
  createSendToken,
  sanitizePasswords,
  statusCodes,
} from '../../helpers';
// import { autoSignToken } from '../../helpers/autoSignToken';

/**
 * @openapi
 * /users/update-password:
 *  patch:
 *   summary: Updates a user password
 *
 *   security:
 *    - bearerAuth: []
 *
 *   consumes:
 *    - application/json
 *
 *   tags:
 *    - users
 *
 *   description: update current password for logged in users
 *
 *   operationId: useToken
 *
 *   responses:
 *    200:
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/TokenGenerated'
 *    401:
 *     description: not authenticated
 *    400:
 *     description: newPassword and newPasswordConfirm must match
 *    default:
 *     description: unexpected error
 *
 *   parameters:
 *    - in: header
 *      name: test-open-api-params
 *      description: just a test
 *      schema:
 *       type: string
 *       example: test-string
 *      required: false
 *
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        currentPassword:
 *         type: string
 *        newPassword:
 *         type: string
 *        newPasswordConfirm:
 *         type: string
 *       required:
 *        - currentPassword
 *        - newPassword
 *        - newPasswordConfirm
 *
 */

/**
 * request handler updatePassword
 * updates current password for logged in users.
 * has side effects.
 */
export const updatePassword = catchAsync(async (req: any, res, next) => {
  // console.log(req, res, next);
  // eslint-disable-next-line no-underscore-dangle
  // const user = User.findById(req.user._id);
  // console.log(user);

  /**
   * ## find user by JWT
   * get header, use verify function
   * the protect route middleware handler already verifies and returns the user in req.user with the password
   */

  /**
   * ## verify if password in body is correct
   * hash password, compare
   */
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  // assure all fields are provided
  if (!currentPassword || !newPasswordConfirm || !newPassword)
    return next(
      new AppError('Please enter all required fields', statusCodes.badRequest)
    );
  // sanitize input
  const [
    sanitizedCurrentPassword,
    sanitizedNewPassword,
    sanitizedNewPasswordConfirm,
  ] = sanitizePasswords(currentPassword, newPassword, newPasswordConfirm);
  // validate chars
  const isInputValid = areAllPasswordsValidAscii(
    sanitizedNewPasswordConfirm,
    sanitizedNewPassword,
    sanitizedCurrentPassword
  );
  if (!isInputValid)
    return next(
      new AppError(
        'Please enter correct input (only ASCII characters allowed)',
        statusCodes.badRequest
      )
    );

  // NOTE: using the passed mongoose user
  const isPasswordCorrect = req.user.comparePassword(
    sanitizedCurrentPassword,
    req.user.password
  );

  // const isPasswordCorrect = await autoComparePassword(
  //     sanitizedCurrentPassword,
  //     req.user.password
  // );
  if (!isPasswordCorrect)
    return next(
      new AppError(
        'Please insert the correct credentials',
        statusCodes.unauthorized
      )
    );

  /**
   * ## if pw is correct, update password with new password and password confirm
   * use req body props
   */
  req.user.password = sanitizedNewPassword;
  req.user.passwordConfirm = sanitizedNewPasswordConfirm;
  await req.user.save(); // don't turn off the validation. we want the validaton to happen

  /**
   * ## log user in and send token
   * change pw modified ( automatically updates on password change with save ( pre hook))
   */
  const tokenPayload = {
    // eslint-disable-next-line no-underscore-dangle
    id: req.user.id as string,
  };

  // const token = await autoSignToken(tokenPayload);
  // void createSendToken({
  //   payload: tokenPayload,
  //   res: _res,
  //   req,

  /**
   * ## KEEP USER LOGGED IN
   */
  await createSendToken({
    payload: tokenPayload,
    res,
    req,
  });

  /**
   * ## send OK
   */
  // res.status(statusCodes.ok).json({
  //   status: 'success',
  //   token,
  // });
});
