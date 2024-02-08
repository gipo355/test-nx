import type { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

import { CURRENT_API_VERSION, WORKER_POOL_ENABLED } from '../config';
// import { WORKER_POOL_ENABLED } from '../config';
import { AppError, catchAsync } from '../helpers';
import { bullmqQueue1 } from '../messageBrokers';
import { User } from '../models';
import { poolProxy } from '../workers';
// import { poolProxy } from '../workers';

// const secret = process.env.JWT_SECRET as string;
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const signToken = async function signJWT(
  payload: Record<string, string | number>
) {
  return new Promise((resolve, reject) => {
    // const token = sign(
    sign(
      payload,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      JWT_SECRET!,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
      (err, asyncToken) => {
        if (err) reject(err);
        resolve(asyncToken);
      }
    );
    // resolve(token);
  });
  // console.log(payload, 'payload');

  // const tokenPayload = { ...payload };
  // console.log(tokenPayload, 'tokenpayload');
  // console.log({ id }, 'object');

  // let token: string | undefined;
  // sign(
  //     token,
  //     JWT_SECRET as string,
  //     {
  //         expiresIn: JWT_EXPIRES_IN,
  //     },
  //     (err, asyncToken) => {
  //         if (err) throw err;
  //         debugger;
  //         token = asyncToken;
  //     }
  // );

  // return token;
};

/**
 * validate jwt token with its verify function
 *
 * @param token - input token
 * @throws {AppError} - invalid token errro
 * @returns payLoad object of the token
 */
const verifyToken: (token: string) => Promise<any> = async function signJWT(
  token: string
) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    verify(token, JWT_SECRET!, {}, (err, decoded) => {
      // if (err) throw err;
      if (err) {
        const errMessage =
          err.message === 'jwt expired'
            ? 'Session expired, please login again.'
            : err.message === 'invalid signature'
            ? 'invalid token, please login or signup'
            : 'Something went wrong. Please login or signup';

        reject(new AppError(errMessage, 401));
      }
      if (decoded) resolve(decoded);
    });
  });
  // console.log(payload, 'payload');

  // const tokenPayload = { ...payloads };
  // console.log(tokenPayload, 'tokenpayload');
  // console.log({ id }, 'object');

  // let decodedPayload: string | JwtPayload = {};
  // verify(token, JWT_SECRET as string, {}, (err, decoded) => {
  //     // if (err) throw err;
  //     if (err) throw new AppError('invalid token', 401);
  //     if (decoded) decodedPayload = decoded;
  // });

  // return decodedPayload;
};

export const signUp = catchAsync(
  async function signUpController(req, res, _next) {
    // ! very bad security flaw, using direct raw input unfiltered
    // const newUser = await User.create(req.body);

    // ! prevent admin creation by only allowing some fields to be provided
    const { name, email, password, passwordConfirm, role } = req.body;
    if (!['guide', 'lead-guide', 'user'].includes(role))
      return _next(
        new AppError('Invalid role: - guide | lead-guide | user - only', 400)
      );
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
    });

    // eslint-disable-next-line no-underscore-dangle

    const tokenPayload = {
      // eslint-disable-next-line no-underscore-dangle
      id: newUser._id as string,
    };
    // console.log(tokenPayload);

    // eslint-disable-next-line no-underscore-dangle
    // const token = await signToken(tokenPayload);
    // const token = await signToken({ id: newUser._id as string });

    // with worker pools
    const token = await (WORKER_POOL_ENABLED === '1'
      ? poolProxy.signTokenWorker(JSON.stringify(tokenPayload))
      : signToken(tokenPayload));

    // console.log(token, 'token');
    // console.log(req.cookies, 'cookies');

    // ! prevent sending back the password
    const hiddenSecretsUser = {
      name: newUser.name,
      email: newUser.email,
      // eslint-disable-next-line no-underscore-dangle
      _id: newUser._id,
    };

    // IMP: CSRF attacks vulnerability with cookies: need csrf token
    // alternatively send cookies ( set pre sending )
    // res.cookie('test-jwt', token, JWT_COOKIE_OPTIONS);

    // status 201 for created
    res.status(201).json({
      status: 'success',
      // token,
      data: {
        user: hiddenSecretsUser,
        // user: newUser,
      },
      token,
    });

    // how to send and redirect?
    // res.status(201).write(
    //     JSON.stringify({
    //         status: 'success',
    //         token,
    //         data: {
    //             user: hiddenSecretsUser,
    //             // user: newUser,
    //         },
    //     })
    // );

    // res.redirect('/api/v1/users/login');
  }
);

export const login = catchAsync(async function loginHandler(req, _res, _next) {
  const { email, password } = req.body;

  if (!email || !password)
    return _next(new AppError('Please provide email and password', 400));

  // create standard error ( don't give info if user exists)
  const invalidError = new AppError('Invalid username or password', 401);

  // find the user by email supplied
  const user = await User.findOne({ email }).select('+password');

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
    id: user._id as string,
  };

  // eslint-disable-next-line no-underscore-dangle
  // const token = await signToken(tokenPayload);

  // with worker pools
  const token = await (WORKER_POOL_ENABLED === '1'
    ? poolProxy.signTokenWorker(tokenPayload)
    : signToken(tokenPayload));

  // alternatively send cookies ( set pre sending )
  // IMP: CAREFUL, COOKIES ARE VULNERABLE TO CSRF ATTACKS
  // _res.cookie('test-jwt', token, JWT_COOKIE_OPTIONS);

  _res.status(200).json({
    status: 'success',
    token,
    // data: {
    //     user: hiddenSecretsUser,
    //     // user: newUser,
    // },
  });
  // _res.redirect(303, '/api/v1/tours'); // will redirect a post request
});

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
  //
  // IMP: steps 1: get token and check if it's there
  // JONAS WAY
  let token: string | undefined;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ').at(1);
  }
  if (!token)
    return next(
      new AppError('You are not logged in. Please login to get access', 401)
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
  const freshUser = await User.findById(decodedPayload.id).select('+role');

  if (!freshUser)
    return next(
      new AppError(
        'The user belonging to this token does no longer exists. Please login or signup.',
        401
      )
    );

  // IMP: step 4: verify if user change password aftert JWT issuance
  if (freshUser.hasPasswordChangedSinceTokenIssuance(decodedPayload.iat))
    return next(
      new AppError('This token is no longer valid. Please login again', 401)
    );

  // if not expired, move on ( add ID in body? )
  // eslint-disable-next-line require-atomic-updates, no-underscore-dangle
  req.user = freshUser._doc;

  next();
});

// export const restrictTo = catchAsync(async function restrictRouteAuth(
//     req: Request,
//     _res: Response,
//     next: NextFunction
// ) {
//     //

//     // i have the user in the req.user object
//     const currentUser: Record<'_id', string> = { ...req.user } as any;
//     // eslint-disable-next-line no-underscore-dangle
//     const user = await User.findById(currentUser._id).select('+isAdmin');

//     if (!user?.isAdmin)
//         return next(
//             new AppError(
//                 `You don't have the right! Oh, you don't have the right! The incident has been reported`,
//                 401
//             )
//         );

//     next();
// });

export const restrictTo = function restrictAccess(
  ...roles: ('admin' | 'user' | 'guide' | 'lead-guide')[]
) {
  // add inverted cascading privileges
  const rolesSet = new Set(roles);
  // rolesSet.add('admin');
  // if (rolesSet.has('guide')) rolesSet.add('lead-guide');

  // NOTE: thanks to closure, inner function gets immediate access to roles array
  // we use wrapper functions ( returned functions or currying/composing )
  return function restrict(_req: Request, _res: Response, next: NextFunction) {
    // const currentUser: Record<'_id', string> = { ..._req.user } as any;
    // eslint-disable-next-line no-underscore-dangle
    // const user = await User.findById(currentUser?._id).select('+role');
    // if (!rolesSet.has(user?.role))

    // avoid calling DB, not needed. reduce network traffic
    if (!rolesSet.has(_req.user?.role))
      return next(
        new AppError(
          `You don't have the right! Oh, you don't have the right! The incident has been reported`,
          403
        )
      );
    next();
  };
};

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
  // if (randomToken.err)
  //     return next(new AppError('There was an error: please try again', 404));

  // 3 places where we could the below code + encryption (encrypt + save to db): pre hook, instance method, here

  // to trigger pre save hook we need to save the document ( the pre hook will encrypt and store the token )
  // user.set({ passwordResetToken: randomToken });
  await user.save({ validateBeforeSave: false }); // IMP: we need validateBeforeSave because otherwise it asks to insert all required fields

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
  )}/api/${CURRENT_API_VERSION}/users/resetpassword/${randomToken}`;

  // will bullmq, send job to que. can be processed by either workerpool worker or standard bullmq worker
  await bullmqQueue1.add(
    'passwordResetEmail', // job name
    {
      type: 'old',
      data: {
        old: {
          subject: 'Password Reset',
          to: user.email,
          message: `You have requested a password reset. Reset URL: ${resetURL}`,
          id: user.id,
        },
      },
    },
    { removeOnComplete: 500, removeOnFail: 2500 }
  );

  res.status(200).json({
    status: 'success',
    token: randomToken,
  });
});

// export const resetPassword = catchAsync(async function resetPassword(
//   req: Request,
//   res: Response
//   // _next: NextFunction
// ) {
//   //
//   // console.log(req);
//   const { token } = req.params;
//   console.log(token);

//   // next();
//   res.status(200).json({
//     status: 'success',
//     message: 'enter password',
//   });
// });
