import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../helpers';

const pageNotFoundController = function pageNotFoundController(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
};

export { pageNotFoundController };
