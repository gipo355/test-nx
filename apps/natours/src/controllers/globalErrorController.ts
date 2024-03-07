import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../helpers';
import { Logger } from '../loggers';

// TODO: implement a standard response object for every type in schemas
// TODO: implement pre made instances of AppError (like 404, 500, 401)

const handleCastError = (err: AppError) => {
  // those errors are from mongodb mongoose?
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateError = (err: AppError) => {
  // those errors are from mongodb mongoose
  let message = 'Something went wrong. Please try again later. (code: 17ec2)';
  if (err.keyValue?.email) {
    message = `this email is already in use`;
  }
  if (err.keyValue?.name) {
    message = `this name is already in use`;
  }
  return new AppError(message, 400);
};

const handleValidationError = async (err: AppError) => {
  const subObjectsArr: Record<string, any>[] = Object.values(err.errors);
  // Promisify the map function
  const errorMessagesArr = await Promise.all(
    subObjectsArr
      // for every key in errors ( price, duration ) return the value of it's name field
      // .map(async ([_, subErrorObject]) => (subErrorObject as any).message)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
      .map(async ({ message }) => message)
  );
  const errorMessages = errorMessagesArr.join('. ');
  return new AppError(`Invalid input data. ${errorMessages}`, 400);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleJWTexpirationError = (_err: any) => {
  const message = `Session expired. Please login again.`;
  return new AppError(message, 401);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleJWTUnauthorized = (_err: any) => {
  const message = `Something went wrong. Please login or signup`;
  return new AppError(message, 401);
};

const sendErrorDev = (
  err: TExpressError,
  newErr: AppError,
  res: Response,
  req: Request
) => {
  /**
   * ## check if error is from frontend or api
   */
  if (req.originalUrl.startsWith('/api')) {
    Logger.error(newErr);
    return res.status(newErr.statusCode).json({
      status: newErr.status,
      stack: err.stack,
      originalError: err,
      newError: newErr,
      message: newErr.message,
    });
  }
  // ! OPERATIONAL ERROR, TRUSTED, result of AppError
  res.status(newErr.statusCode).render('error', {
    title: 'Uh Oh! Something went wrong!',
    message: JSON.stringify({ ...newErr, ...err }),
    code: newErr.statusCode,
  });
};

const sendErrorProd = (
  _err: Error,
  newErr: AppError,
  res: Response,
  req: Request
) => {
  /**
   * ## check if error is from frontend or api
   * BELOW DOESN'T WORK
   * REQ.ORIGINALURL IS ALWAYS /API/USERS/LOGIN
   */

  if (!req.originalUrl.startsWith('/api') && newErr.isOperationalError) {
    res.status(newErr.statusCode).render('error', {
      title: 'Uh Oh! Something went wrong!',
      message: newErr.message,
      code: newErr.statusCode,
    });
    return;
  }

  if (!req.originalUrl.startsWith('/api') && !newErr.isOperationalError) {
    // API no operational
    /**
     * ## we want to log this because otherwise we won't see it in the frontend
     */
    Logger.error(newErr);
    res.status(newErr.statusCode).render('error', {
      title: 'Uh Oh! Something went wrong!',
      message: 'Please try again later.',
      code: 500,
    });
    return;
  }

  if (newErr.isOperationalError) {
    // ! OPERATIONAL ERROR, TRUSTED, result of AppError
    res.status(newErr.statusCode).json({
      status: newErr.status,
      message: newErr.message,
    });
    return;
  }
  // ! UNKNOWN ERROR, PROGRAMMING BUG, CAN'T LEAK DETAILS TO CLIENT
  // LOG to keep track of unknown behavior
  Logger.error(
    JSON.stringify({
      timeStamp: Date.now(),
      status: newErr.status,
      stack: _err.stack,
      originalError: _err,
      newError: newErr,
      message: newErr.message,
    })
  );
  // jonas says that console.log will make it available on the hosting platform
  // console.error({
  //     status: newErr.status,
  //     stack: _err.stack,
  //     error: _err,
  //     message: newErr.message,
  // });

  // send generic message
  res.status(500).json({
    status: 'error',
    message: 'something went wrong!',
  });
};
export const globalErrorController = (
  err: AppError,
  _req: Request,
  _res: Response,
  _next: NextFunction
) => {
  (async () => {
    // assign the vars as spreading the object won't inherit Prototype methods
    // only hasOwnProperty is passed on spread ( message is not )
    // set defaults
    const {
      statusCode = 500,
      status = 'error',
      message = 'internal server error',
      name,
      code,
      isOperationalError = false,
    } = err;

    // reassign to new object to avoid mutation
    let newErr = {
      ...err,
      statusCode,
      status,
      message,
      isOperationalError,
    };

    if (process.env.NODE_ENV === 'development') {
      Logger.error('error', err);

      sendErrorDev(err, newErr, _res, _req);
    } else {
      // if it's a wrong ID search
      if (name === 'CastError') newErr = handleCastError(newErr);
      // keyPattern.Name is a prop that exists on duplicate error
      if (code === 11_000) newErr = handleDuplicateError(newErr);

      if (name === 'ValidationError')
        newErr = await handleValidationError(newErr);

      if (err.message.startsWith('JsonWebTokenError')) {
        newErr = handleJWTUnauthorized(newErr);
      }
      if (err.message.startsWith('TokenExpiredError')) {
        newErr = handleJWTexpirationError(newErr);
      }
      sendErrorProd(err, newErr, _res, _req);
    }
  })().catch((error) => {
    throw error;
  });
};
