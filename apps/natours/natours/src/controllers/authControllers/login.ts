// import { WORKER_POOL_ENABLED } from '../../config';
import {
  AppError,
  // autoSignToken,
  catchAsync,
  createSendToken,
  statusCodes,
  // statusCodes,
} from '../../helpers';
import { User } from '../../models';
// import { poolProxy } from '../../workers';
// import { signToken } from './signToken';

/**
 * @openapi
 * /users/login:
 *  post:
 *   summary: logs user in
 *
 *   consumes:
 *    - application/json
 *
 *   tags:
 *    - users
 *
 *   description: logs users in
 *
 *   responses:
 *    200:
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/TokenGenerated'
 *     links:
 *      UseToken:
 *       operationId: useToken
 *       parameters:
 *        token: $response.body#/token
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
 *        password:
 *         type: string
 *       required:
 *        - email
 *        - password
 *
 */
export const login = catchAsync(async function loginHandler(req, _res, _next) {
  const { email, password } = req.body;

  if (!email || !password)
    return _next(new AppError('Please provide email and password', 400));

  // create standard error ( don't give info if user exists)
  const invalidError = new AppError('Invalid username or password', 401);

  // find the user by email supplied
  const user = await User.findOne({ email }).select('+password +verified');

  // console.log('user', user);
  // console.log(req.body, 'req.body');

  // if not verified, ask to verify email
  if (user && !user.verified) {
    return _next(
      new AppError(
        'Please verify your email before logging in',
        statusCodes.unauthorized
      )
    );
  }

  // ! this won't contain the password!! we select: false in the property
  // this is why we need a method

  // ! prefer stopping the program before using the bcrypto package as it is computationally expensive
  // an attacker could see the difference in response time to check if it actually triggered the comparePassword function
  // handle invalid user
  // if (!user) return _next(invalidError);
  // wihout mongoose instance method
  // const isValid = await (WORKER_POOL_ENABLED === '1'
  //     ? poolProxy.comparePasswordWorker(password, user?.password)
  //     : comparePassword(password, user?.password));
  // with mongoose instance method
  // const isValid = await user.comparePassword(password, user?.password);
  // handle invalid password
  // if (!isValid) return _next(invalidError);

  // ! jonas way, all in one ( still exits without using the function due to short circuit)
  if (!user || !(await user.comparePassword(password, user.password)))
    return _next(invalidError);

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

  // alternatively send cookies ( set pre sending )
  // IMP: CAREFUL, COOKIES ARE VULNERABLE TO CSRF ATTACKS
  // _res.cookie('test-jwt', token, JWT_COOKIE_OPTIONS);

  // _res.status(200).json({
  //     status: 'success',
  //     token,
  //     // data: {
  //     //     user: hiddenSecretsUser,
  //     //     // user: newUser,
  //     // },
  // });
  // _res.redirect(303, '/api/v1/tours'); // will redirect a post request

  // eslint-disable-next-line no-void
  void createSendToken({
    payload: tokenPayload,
    res: _res,
    req,
  });
});
