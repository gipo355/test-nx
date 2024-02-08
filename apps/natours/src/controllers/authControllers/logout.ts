import type { Request, Response } from 'express';

import { JWT_COOKIE_OPTIONS } from '../../config';
import { statusCodes } from '../../helpers';

const logout = function logoutHandler(_req: Request, res: Response) {
  res.clearCookie('jwt', JWT_COOKIE_OPTIONS);

  res.status(statusCodes.noContent).json({
    status: 'success',
    // eslint-disable-next-line unicorn/no-null
    message: null,
  });
  // res.redirect('/');
};

export { logout };
