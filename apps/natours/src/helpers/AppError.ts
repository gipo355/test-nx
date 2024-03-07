class AppError extends Error {
  keyValue?: {
    name?: string;
    email?: string;
  };
  code?: number;

  errors?: Record<string, unknown>;

  path?: string;

  value?: string;

  statusCode: number;

  status: string;

  isOperationalError: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    // we didn't call this.message = message because the parent class is Error and already sets the this.message
    // we already set the message prop to incoming message

    this.statusCode = statusCode;
    // this.status = statusCode === 500 ? 'error' : 'fail';
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // set a property to distinguish between operationa errors we defined with this class
    this.isOperationalError = true;

    // this is object itself, AppError is this.constructor
    // when a new object is created and a constructor function is called, the function call is not going to appear in the stack trace and will not pollute it
    // this is needed to avoid polluting the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };
