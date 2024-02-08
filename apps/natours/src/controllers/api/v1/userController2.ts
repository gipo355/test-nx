/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextFunction, type Request, type Response } from 'express';

import {
  APIFeaturesJonas,
  AppError,
  catchAsync,
  filterObject,
  statusCodes,
} from '../../../helpers';
import { User } from '../../../models';
import { createOne } from './createOne';
import { deleteOne } from './deleteOne';
import { getAll } from './getAll';
import { getOne } from './getOne';
import { patchOne } from './patchOne';

const getAllUsers = getAll({
  Model: User,
  idName: 'userId',
});

const getUser = getOne({
  Model: User,
  idName: 'userId',
});

const postNewUser = createOne({
  Model: User,
  idName: 'userId',
});

const patchUser = patchOne({
  Model: User,
  idName: 'userId',
});

const deleteUser = deleteOne({
  Model: User,
  idName: 'userId',
});

const deleteMe = catchAsync(async function deleteMe(req: any, res: Response) {
  //
  await User.findByIdAndUpdate(
    // eslint-disable-next-line no-underscore-dangle
    req.user?._id,
    { active: false }
  );

  res.status(statusCodes.noContent).json({
    status: 'success',
    // eslint-disable-next-line unicorn/no-null
    data: null,
  });
});

export {
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  patchUser,
  postNewUser,
  // updateMe,
};
