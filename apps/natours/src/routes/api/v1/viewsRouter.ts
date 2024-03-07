import { Router } from 'express';

import {
  alertParser,
  // createBookingCheckout,
  getLoginForm,
  getMePage,
  getMyBookings,
  getSignupForm,
  getViewsOverview,
  // getViewsRoot,
  getViewsTour,
  isLoggedInAndPassUserData,
  protectRoute,
  updateUserData,
} from '../../../controllers';

const router = Router();

router.use(alertParser);

/**
 * ## PUG built-in
 */
router.get(
  '/',
  // createBookingCheckout, // old implementation before stripe webhooks
  isLoggedInAndPassUserData,
  getViewsOverview
);
// router.get('/overview', getViewsOverview);
router.get('/tour/:tourSlug', isLoggedInAndPassUserData, getViewsTour);

/**
 * ## Me route, account page
 */
router.get('/me', protectRoute, getMePage);

/**
 * ## FORM route to update user data on account page
 */
router.post('/submit-user-data', protectRoute, updateUserData);

/**
 * ## LOGIN route
 */
router.get('/login', getLoginForm);

/**
 * ## Sign up
 */
router.get('/signup', getSignupForm);

/**
 * ## Bookings route
 */
router.get('/my-bookings', protectRoute, getMyBookings);

/**
 * ## PUG pug-loader
 * this below would be the way to do it with webpack pug loader, no render but send
 */
// router.get('/', (_req: Request, res: Response) => {
//   const properties = {
//     name: 'Jonas',
//   };
//   const html = testPug(properties);
//   res.status(200).send(html);
//   // res.status(200).render(html); rende doesn't work with pug-loader
// });

export { router as viewsRouter };
