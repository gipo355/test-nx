import type { DoubleCsrfConfigOptions } from 'csrf-csrf';
import { doubleCsrf } from 'csrf-csrf';
import type { NextFunction, Request, Response } from 'express';

import { CSRF_ENABLED, CSRF_SECURE_COOKIES_ENABLED } from '../config';

const { CSRF_SECRET } = process.env;

const doubleCsrfOptions: DoubleCsrfConfigOptions = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  getSecret: () => CSRF_SECRET!,
  cookieOptions: {
    secure: CSRF_SECURE_COOKIES_ENABLED,
  },
};

// TODO: it requires relogging after session ends
// const { generateToken, doubleCsrfProtectionOG } = doubleCsrf(doubleCsrfOptions);
const { generateToken } = doubleCsrf(doubleCsrfOptions);
// let { doubleCsrfProtection } = doubleCsrf(doubleCsrfOptions);
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const { doubleCsrfProtection } = CSRF_ENABLED
  ? doubleCsrf(doubleCsrfOptions)
  : {
      doubleCsrfProtection: (
        _req: Request,
        _res: Response,
        next: NextFunction
      ) => next(),
    };

// doubleCsrfProtection = CSRF_ENABLED
// ? doubleCsrfProtection
// : (_req: Request, _res: Response, next: NextFunction) => next();

export { doubleCsrfProtection, generateToken };
