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
import { catchAsync } from '../../../helpers';
import { poolProxy } from '../../../workers';

const router = Router();

router.use(alertParser);

// TODO: remove testing routes
const createHash = catchAsync(async function createHash(_req, res) {
  const hash = await poolProxy.encryptPasswordWorker('asdfsadf', 12);
  // Logger.info(pool1.stats());
  res.status(200).json({
    status: 'success',
    data: {
      hash,
    },
  });
});

// testing autocannon
router.route('/bcrypto').get(createHash);
router.route('/test-load').get((_req, res) => {
  res.status(200).send('ok'.repeat(1000));
});

// __webpack_public_path__ = '/';

/**
 * ## we can't put this here, overview will trigger many requests on its own and it will trigger for everything, even css and images
 */
// router.use(isLoggedInAndPassUserData);
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
