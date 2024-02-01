import type { NextFunction, Request, Response } from 'express';

import { AppError, catchAsync } from '../../helpers';

export const restrictTo = function restrictAccess(
  ...roles: ('admin' | 'user' | 'guide' | 'lead-guide')[]
) {
  // add inverted cascading privileges
  const rolesSet = new Set(roles);
  // rolesSet.add('admin');
  // if (rolesSet.has('guide')) rolesSet.add('lead-guide');

  // NOTE: thanks to closure, inner function gets immediate access to roles array
  // we use wrapper functions ( returned functions or currying/composing )
  // eslint-disable-next-line @typescript-eslint/require-await
  return catchAsync(async function restrict(
    _req: Request,
    _res: Response,
    next: NextFunction
  ) {
    // const currentUser: Record<'_id', string> = { ..._req.user } as any;
    // eslint-disable-next-line no-underscore-dangle
    // const user = await User.findById(currentUser?._id).select('+role');
    // if (!rolesSet.has(user?.role))

    // avoid calling DB, not needed. reduce network traffic
    if (!rolesSet.has((_req.user as any)?.role))
      return next(
        new AppError(
          `You don't have the right! Oh, you don't have the right! The incident has been reported`,
          403
        )
      );
    next();
  });
};
