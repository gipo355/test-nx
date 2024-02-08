/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';

import {
  AppError,
  autoResizeImage,
  catchAsync,
  filterObject,
  imagekit,
  statusCodes,
} from '../../../helpers';
import { User } from '../../../models';
import { createOne } from './createOne';
import { deleteOne } from './deleteOne';
import { getAll } from './getAll';
import { getOne } from './getOne';
import { patchOne } from './patchOne';

/**
 * Configuring multerStorage
 * ## we can even create multer storage as buffer in memory to use later by other processe
 * IMP: the below is for saving to disk
 */
// const multerStorage = multer.diskStorage({
//   /**
//    * ## null if no error, callback is not from express, not next
//    */
//   destination: (_req, _file, callback) => {
//     // eslint-disable-next-line unicorn/no-null
//     callback(null, 'public/img');
//   },
//   filename: (_req, file, callback) => {
//     // eslint-disable-next-line unicorn/no-null
//     /**
//      * ## user-userId-timestamp.ext to prevent duplicates
//      */
//     const extension = file.mimetype.split('/').at(-1);
//     // eslint-disable-next-line unicorn/no-null
//     callback(null, `user-${_req.user?.id}-${Date.now()}.${extension}`);
//   },
// });
/**
 * we don't want to save to storage the image because we want to resize it first
 * ## IMP: the below is for saving in memory, as a buffer, to be used by sharp
 */
const multerStorageInMemory = multer.memoryStorage();

/**
 * ## multerFilter
 */
const multerFilter = (
  _req: Request,
  file: any,
  callback: (...parameter: any) => any
) => {
  // const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  // eslint-disable-next-line unicorn/no-null
  // callback(null, true);

  // if (allowedMimeTypes.includes(_req.file?.mimetype)) {
  if (file?.mimetype?.startsWith('image')) {
    // eslint-disable-next-line unicorn/no-null
    return callback(null, true);
  }

  return callback(
    new AppError(
      'Invalid file type. Only jpg, jpeg, png files are allowed',
      statusCodes.badRequest
    ),
    false
  );
};

// const upload = multer({ dest: 'public/img/users' });
const upload = multer({
  storage: multerStorageInMemory,
  fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single('photo');

/**
 * ## trying with imagekit
 */
const uploadUserPhotoImagekit = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    /**
     * ## check tourController for more details
     */
    if (!req.file) return next();

    const folderPath = `${req.user?.id}/user/`;

    try {
      await imagekit?.deleteFolder(folderPath);
      // eslint-disable-next-line no-empty
    } catch {}

    const imageUserFilename = `user-${req.user?.id}-${Date.now()}.jpeg`;

    const imgkitResponse = await imagekit?.upload({
      file: req.file.buffer,
      fileName: imageUserFilename,
      folder: folderPath,
    });

    if (!imgkitResponse) {
      return next(
        new AppError(
          'Something went wrong while uploading the image to imagekit',
          statusCodes.internalServerError
        )
      );
    }

    const imageUserURL = imagekit?.url({
      path: `${folderPath}${imgkitResponse.name}`,
      transformation: [
        {
          height: '500',
          width: '500',
        },
      ],
    });

    // eslint-disable-next-line require-atomic-updates
    if (!imageUserURL)
      return next(
        new AppError(
          'Something went wrong while uploading the image to imagekit',
          statusCodes.internalServerError
        )
      );

    // eslint-disable-next-line require-atomic-updates
    req.file.filename = imageUserURL;

    next();
  }
);

const resizeUserPhoto = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    /**
     * ## if no file, skip
     */
    if (!req.file) return next();

    /**
     * ## we need to save to req.file.filename because we save the name to db in update-me middleware
     * also notice we rename the picture
     */
    req.file.filename = `user-${req.user?.id}-${Date.now()}.jpeg`;

    /**
     * ## resize image with sharp package
     */
    await autoResizeImage(req.file.buffer, req.file.filename);

    // file.toFile(`public/img/users/${req.file.filename}`);
    next();
  }
);
const getAllUsers = getAll({
  Model: User,
});

const getUser = getOne({
  Model: User,
  idName: 'userId',
});
const postNewUser = createOne({
  Model: User,
});
const patchUser = patchOne({
  Model: User,
  idName: 'userId',
});

const deleteUser = deleteOne({
  Model: User,
  idName: 'userId',
});

/**
 * @openapi
 * /users/update-me:
 *  patch:
 *   summary: Updates a user data
 *
 *   security:
 *    - bearerAuth: []
 *
 *   consumes:
 *    - application/json
 *
 *   tags:
 *    - users
 *
 *   description: update current data (email, name) for logged in user
 *
 *   operationId: useToken
 *
 *   responses:
 *    200:
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          example: success
 *         data:
 *          type: object
 *          properties:
 *           user:
 *            type: object
 *            properties:
 *             _id:
 *              type: string
 *             name:
 *              type: string
 *             email:
 *              type: string
 *
 *    401:
 *     description: not authenticated
 *    400:
 *     description: only name and email can be updated
 *    default:
 *     description: unexpected error
 *
 *   parameters:
 *    - in: header
 *      name: test-open-api-params
 *      description: just a test
 *      schema:
 *       type: string
 *       example: test-string
 *      required: false
 *
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *        email:
 *         type: string
 *
 */

/**
 * user controller to update name and email
 * @description
 * this is a middleware handler for the route update-me
 *
 * @param req - Request
 * @param res - Response
 * @param next - NextFunction
 */
const updateMe = catchAsync(async function updateUser(
  req: any,
  res: Response,
  next: NextFunction
) {
  // console.log(req.file, 'updateMe');
  // console.log(req.body, 'updateMe');

  // IMP: this requires to be logged in. the protect route adds the user to the req body. i don't need to call the db, i already have it
  /**
   * ## create error if user tries to update the password
   */
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        `You can't change the password on this route. Please use /update-password.`,
        statusCodes.badRequest
      )
    );
  /**
   * ## update user document
   * be mindful of: validations, required fields, change what's inputted only
   */

  /**
   * ## NOTE: old way with find and save
   */
  // const user = await User.findById(req.user?.id);
  // user!.name = req.user?.name;
  // user!.email = req.user?.email;
  // await user!.save();
  /**
   * ## NOTE: new way with findByIdandUpdate
   * update the document
   */

  // const updateProperties = {
  //     ...(req.body.name && { name: req.body.name }),
  //     ...(req.body.email && { email: req.body.email }),
  // }; // don't allow to update everything
  // jonas way, making a filter function
  const filteredBody: Record<string, string> = filterObject({
    toFilter: req.body,
    wantedKeys: ['name', 'email'],
  });

  /**
   * ## adding photo to the user in the database   */
  if (req.file) filteredBody.photo = req.file.filename;

  // id to find, object with fields to update, options (new = return the new user)
  // we can use findByIdAndUpdate here because we don't need prehooks and validators
  // IMP: validators for name and email work. it's the prehook that won't
  const updatedUser = await User.findByIdAndUpdate(
    // eslint-disable-next-line no-underscore-dangle
    req.user?._id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(statusCodes.ok).json({
    status: 'success',
    data: {
      user: {
        id: updatedUser?.id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        ...(updatedUser?.photo && { photo: updatedUser.photo }),
      },
    },
  });
});

/**
 * @openapi
 * /users/delete-me:
 *  delete:
 *   summary: deletes a user
 *
 *   security:
 *    - bearerAuth: []
 *
 *   tags:
 *    - users
 *
 *   description: deletes a user
 *
 *   responses:
 *    204:
 *     description: no content
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          example: success
 *         data:
 *          type: null
 *          example: null
 *
 *    401:
 *     description: not authenticated
 *    default:
 *     description: unexpected error
 */
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

/**
 * @openapi
 * /users/me:
 *  get:
 *   summary: get my informatio
 *
 *   security:
 *    - bearerAuth: []
 *
 *   tags:
 *    - users
 *
 *   description: get my information
 *
 *   responses:
 *    200:
 *     description: user information
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          example: success
 *         data:
 *          type: null
 *          example: null
 *
 *    401:
 *     description: not authenticated
 *    default:
 *     description: unexpected error
 */
const getMe = function getMe(req: Request, _res: any, next: NextFunction) {
  req.params.userId = req.user?.id;
  next();
};

export {
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  patchUser,
  postNewUser,
  resizeUserPhoto,
  updateMe,
  uploadUserPhoto,
  uploadUserPhotoImagekit,
};
