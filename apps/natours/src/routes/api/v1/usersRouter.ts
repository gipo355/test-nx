/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { createReadStream, readFile } from 'node:fs';

// import { readFileSync, writeFile } from 'node:fs';

// import toursJSON from '../../../../assets/filedb.json';
// import json from '../../../../assets/dev-data/data/tours-simple.json';
// import { url } from 'node:inspector';
// import path from 'node:path';

import { Router } from 'express';

import { CSRF_ENABLED, IS_IMAGEKIT_ENABLED } from '../../../config';
import {
  deleteMe,
  deleteUser,
  forgotPassword,
  getAllUsers,
  // updateMe,
  getMe,
  getOne,
  getUser,
  login,
  patchUser,
  postNewUser,
  protectRoute,
  resetPassword,
  resizeUserPhoto,
  restrictTo,
  signUp,
  unsupportedMethodHandler,
  updateMe,
  updatePassword,
  uploadUserPhoto,
  uploadUserPhotoImagekit,
  validateAndSetIdAndDocument,
  verifyEmail,
} from '../../../controllers';
// import {
// } from '../../../controllers/api/v1/userController';
import { logout } from '../../../controllers/authControllers/logout';
import { doubleCsrfProtection } from '../../../helpers';
import { User } from '../../../models';
import { bookingsRouterV1 } from './bookingsRouter';
// import { catchAsync } from '../../../helpers';
// import { poolProxy } from '../../../workers';

const router = Router();

/**
 * ## load multer to upload files
 */

router.route('/signup').post(
  /**
   * ## WITHOUT USING THE MULTER MIDDLEWARE I CAN'T RECEIVE THE
   * X-WWW-FORM-URLENCODED DATA IN THE REQ.BODY
   * the urlencoded() middleware is not working?
   * because formdata only works with enctype: multipart/form-data which
   * is not supported by urlencoded() middleware and requires multer
   *
   * it works in postman but not from the browser?
   */
  signUp
);
router.route('/verify-email/:token').get(verifyEmail); // catches anything else
// .get(unsupportedMethodHandler)
// .put(unsupportedMethodHandler)
// .delete(unsupportedMethodHandler)
// .patch(unsupportedMethodHandler);
// ##### better unsupportedMethodHandler
router.use('/signup', unsupportedMethodHandler); // catches anything else

router.route('/login').post(login);
router.use('/login', unsupportedMethodHandler); // catches anything else

router.route('/logout').get(logout);
router.use('/logout', unsupportedMethodHandler); // catches anything else

router.route('/forgot-password').post(forgotPassword);
router.use('/forgot-password', unsupportedMethodHandler);

router.route('/reset-password/:token').patch(resetPassword);
router.use('/reset-password', unsupportedMethodHandler);

// ! IMP: auth required here
// require login for all of the below routes
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (CSRF_ENABLED) router.use(doubleCsrfProtection);
router.use(protectRoute);

/**
 * ## redirect to bookingsRouterV1 to filter bookings by userId
 */
router.use(
  '/:userId/bookings',
  restrictTo('admin', 'lead-guide', 'guide'),
  validateAndSetIdAndDocument({
    idName: 'userId',
    Model: User,
    setDocument: false,
  }),
  bookingsRouterV1
);

/**
 * ## multer middleware to upload a single file
 * the string is the field name in the html form
 * the middleware will take the file and copy it to the destination specified
 */
router.route('/update-me').patch(
  uploadUserPhoto,
  // // // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  IS_IMAGEKIT_ENABLED ? uploadUserPhotoImagekit : resizeUserPhoto,
  updateMe
);
router.use('/update-me', unsupportedMethodHandler);

router.route('/delete-me').delete(deleteMe);
router.use('/delete-me', unsupportedMethodHandler);

router.route('/update-password').patch(updatePassword);
router.use('/update-password', unsupportedMethodHandler);

router.route('/me').get(getMe, getOne({ Model: User, idName: 'userId' }));

/**
 * ## ! IMP: adming restricted
 * delete will actually delete
 */
router.use(restrictTo('admin')); // restrict all routes below to admin only
router.route('/').get(getAllUsers).post(postNewUser);
router
  .route('/:userId') // this will catch the unhandled routes from update-password ( update-password is counted as ID )
  .get(getUser) // even more selective middleware
  .patch(patchUser)
  .delete(deleteUser); // only the admin can delete users (users can deactivate only)

// handle unsupportedMethodRouter
// router.use(unsupportedMethodRouter);

// catch all unsupported requests in this route
router.use(unsupportedMethodHandler);

export { router as usersRouterV1 };
