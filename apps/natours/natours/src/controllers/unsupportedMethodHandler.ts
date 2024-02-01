import { AppError } from '../helpers';

// ! router for handling unsupported methods
export const unsupportedMethodHandler = (_req: any, _res: any, _next: any) => {
  _next(
    new AppError(`${_req.method} is not a valid method on this endpoint`, 400)
  );
};
