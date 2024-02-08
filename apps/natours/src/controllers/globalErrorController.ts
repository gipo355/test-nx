import { AppError } from '../helpers';
import { Logger } from '../loggers';

const handleCastError = (err: any) => {
  //
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateError = (err: any) => {
  //
  // BUG: keyvalue can be
  // { name: 'test', email: 'test@test' }
  // let message = `invalid name: ${err.keyValue.name} is a duplicate`;
  let message = 'Something went wrong. Please try again later. (code: 17ec2)';
  if (err.keyValue.email) {
    message = `this email is already in use`;
  }
  if (err.keyValue.name) {
    message = `this name is already in use`;
  }
  return new AppError(message, 400);
};

const handleValidationError = async (err: any) => {
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

const sendErrorDev = (err: any, newErr: any, res: any, req: any) => {
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
  return res.status(newErr.statusCode).render('error', {
    title: 'Uh Oh! Something went wrong!',
    message: JSON.stringify({ ...newErr, ...err }),
    code: newErr.statusCode,
  });
};

const sendErrorProd = (_err: any, newErr: any, res: any, req: any) => {
  // console.log(_err, 'err');
  // console.log(newErr, 'newErr');

  /**
   * ## check if error is from frontend or api
   * BELOW DOESN'T WORK
   * REQ.ORIGINALURL IS ALWAYS /API/USERS/LOGIN
   */
  if (!req.originalUrl.startsWith('/api') && newErr.isOperationalError) {
    // operational FE

    return res.status(newErr.statusCode).render('error', {
      title: 'Uh Oh! Something went wrong!',
      message: newErr.message,
      code: newErr.statusCode,
    });
  }
  if (!req.originalUrl.startsWith('/api') && !newErr.isOperationalError) {
    // API no operational
    // if (_err.isOperationalError) {
    /**
     * ## we want to log this because otherwise we won't see it in the frontend
     */
    Logger.error(newErr);
    return res.status(newErr.statusCode).render('error', {
      title: 'Uh Oh! Something went wrong!',
      message: 'Please try again later.',
      code: 500,
    });
  }
  if (newErr.isOperationalError) {
    // ! OPERATIONAL ERROR, TRUSTED, result of AppError
    return res.status(newErr.statusCode).json({
      status: newErr.status,
      message: newErr.message,
    });
  }
  // ! UNKNOWN ERROR, PROGRAMMING BUG, CAN'T LEAK DETAILS TO CLIENT
  // LOG to keep track of unknown behavior
  Logger.error({
    timeStamp: Date.now(),
    status: newErr.status,
    stack: _err.stack,
    originalError: _err,
    newError: newErr,
    message: newErr.message,
  });
  // jonas says that console.log will make it available on the hosting platform
  // eslint-disable-next-line no-console
  // console.error({
  //     status: newErr.status,
  //     stack: _err.stack,
  //     error: _err,
  //     message: newErr.message,
  // });

  // send generic message
  return res.status(500).json({
    status: 'error',
    message: 'something went wrong!',
  });
};
export const globalErrorController = (
  err: any,
  _req: any,
  _res: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: any
) => {
  (async () => {
    // assign the vars as spreading the object won't inherit Prototype methods
    // only hasOwnProperty is passed on spread ( message is not )
    // set defaults
    const {
      statusCode = 500,
      status = 'error',
      message = 'internal server error',
    } = err;
    // reassign to new object to avoid mutation
    let newErr = { statusCode, status, message, ...err };

    if (process.env.NODE_ENV === 'development') {
      Logger.error('error', err);

      sendErrorDev(err, newErr, _res, _req);
    } else {
      // console.log('globalErrorController prod');
      // console.log(newErr, 'newErr');
      // console.log(err, 'err');
      // eslint-disable-next-line unicorn/consistent-destructuring
      // console.log(err.code);
      // console.log(err.name);

      // if it's a wrong ID search
      if (err.name === 'CastError') newErr = handleCastError(newErr);
      // keyPattern.Name is a prop that exists on duplicate error
      // eslint-disable-next-line unicorn/consistent-destructuring
      if (err.code === 11_000) newErr = handleDuplicateError(newErr);

      if (err.name === 'ValidationError')
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
