import { type NextFunction, type Request, type Response } from 'express';
import type mongoose from 'mongoose';

import { AppError, catchAsync, statusCodes } from '../../../helpers';
import { Booking, Tour } from '../../../models';

/**
 * ## this is not used, only example
 */
const getViewsRoot = function getRoot(
  _req: Request,
  res: Response
  // next: NextFunction
) {
  res.status(statusCodes.ok).render('base', {
    title: 'Natours | Exciting tours for adventurous people',
    // tour: 'The Forest Hiker',
  });
};

/**
 * ## main root page, index
 */
const getViewsOverview = catchAsync(async function getOverview(
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  /**
   * ## steps to take
   * 1: get tour data from api
   * 2: build template
   * 3: render that template using tour data from step 1
   */

  // step 1
  const tours = await Tour.find();

  // console.log(req.user);

  // step 2 and 3
  res.status(statusCodes.ok).render('overview', {
    title: 'Natour',
    // tour: 'All Tours',
    tours, // this is the step 2, we pass the tour
    // user: req.user,
  });
});

const getViewsTour = catchAsync(async function getTour(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /**
   * ## steps:
   * get the data for the tour, including reviews and guides with populate
   */
  const { tourSlug } = req.params;

  /**
   * ## we need to populate reviews ( guides is automatic )
   * remember how to prevent circular population
   */
  const tour = await Tour.findOne({
    slug: tourSlug,
  })
    // .populate('guides', 'role name photo')
    .populate({
      path: 'reviews',
      // select: ['-tour'], // this is not working, if i remove the tour, the array is emty
      select: 'review rating user',
    });
  // .populate('reviews', '-tour -__v');
  // console.log(tour);

  if (!tour) {
    next(new AppError('There is no tour with that name', statusCodes.notFound));
    return;
  }

  /**
   * IMP: ###### CONTENT SECURITY POLICY OVERWRITE
   *
   * ## SINCE WE ARE USING A CDN FOR MAPBOX, WE NEED TO ALLOW THE URL IN THE CONTENT SECURITY POLICY
   * or it won't execute exteernal scripts neither connect to external servers nor load external stylesheets
   */
  // res.setHeader(
  //   'Content-Security-Policy',
  //   // 'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com'

  //   // "script-src 'self' https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js; style-src 'self' * 'unsafe-inline'; worker-src blob:"
  //   // "script-src 'self' https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js; style-src 'self' https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css https://fonts.googleapis.com; worker-src blob:"

  //   "script-src 'self' https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js https://cdnjs.cloudflare.com/ajax/libs/mapbox-gl/2.15.0/mapbox-gl.js; style-src 'self' 'sha512-GPA+Da72PFFDoGphWw8KnqAFq/v/qsizJqomP82+tVCLgWlSgc5atMllkFaSAJF931RUCCl0ZDJF5J3yqsQVCg==' 'sha512-GPA+Da72PFFDoGphWw8KnqAFq/v/qsizJqomP82+tVCLgWlSgc5atMllkFaSAJF931RUCCl0ZDJF5J3yqsQVCg==' https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css https://fonts.googleapis.com https://cdnjs.cloudflare.com/ajax/libs/mapbox-gl/2.15.0/mapbox-gl.min.css; worker-src blob:"
  //   // "style-src 'self' https://cdnjs.cloudflare.com/ajax/libs/mapbox-gl/2.15.0/mapbox-gl.min.css;"
  //   // "script-src 'self' 'sha512-YdWxZhXXooMYaYcGo5DQJP6K0qP1aXzQ3u3znOFPPCY/xnQ9DjD6YggUmdrSQwkO+3zRiSrnuUMh4Xt1xoR90Q==';style-src 'self' 'sha512-fPYzCDCwWGaqR93cxlCAZSqnHnabV5//RllFHLzi6L620mq7YtlyrBIUZbwttOkFFQgwVff/QMKpBPcQ4kH2dg=='"
  //   // "style-src 'self' sha512-YdWxZhXXooMYaYcGo5DQJP6K0qP1aXzQ3u3znOFPPCY/xnQ9DjD6YggUmdrSQwkO+3zRiSrnuUMh4Xt1xoR90Q=="
  //   // "default-src 'self' cdnjs.cloudflare.com/ajax/libs/mapbox-gl/2.15.0/mapbox-gl.min.css cdnjs.cloudflare.com/ajax/libs/mapbox-gl/2.15.0/mapbox-gl.min.js"
  //   // "default-src 'self' *.mapbox.com *.googleapis.com fonts.gstatic.com cdnjs.cloudflare.com/ajax/libs/mapbox-gl/* 'sha512-GPA+Da72PFFDoGphWw8KnqAFq/v/qsizJqomP82+tVCLgWlSgc5atMllkFaSAJF931RUCCl0ZDJF5J3yqsQVCg==' 'sha512-fPYzCDCwWGaqR93cxlCAZSqnHnabV5//RllFHLzi6L620mq7YtlyrBIUZbwttOkFFQgwVff/QMKpBPcQ4kH2dg=='"
  //   // ''
  // );

  // console.log(res.getHeader('Content-Security-Policy'));

  /**
   * ## Commented out - implemented in global controller with helmet
   */
  // const csp = res.getHeader('Content-Security-Policy') as string;
  // /**
  //  * ## change script-src to allow mapbox
  //  */
  // const newCsp =
  //     // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  //     csp &&
  //     csp
  //         .split(';')
  //         .map((element: any) => {
  //             element.trim();
  //             if (element.startsWith('script-src ')) {
  //                 return `script-src 'self' https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js https://cdnjs.cloudflare.com/ajax/libs/mapbox-gl/2.15.0/mapbox-gl.js api.mapbox.com; worker-src blob:; connect-src *.mapbox.com`;
  //                 // return `helloo`;
  //             }
  //             return element;
  //         })
  //         .join(';');
  // // console.log(newCsp);

  // if (newCsp) res.setHeader('Content-Security-Policy', newCsp);
  /**
   * ## End of Commented out - implemented in global controller with helmet
   */

  res.status(statusCodes.ok).render('tour', {
    title: 'Natour',
    tour,
    // user: req.user,
  });
});

/**
 * ## Login route
 */
const getLoginForm = function getLoginForm(_req: Request, res: Response) {
  res.status(statusCodes.ok).render('login', {
    title: 'Natour | Log into your account',
  });
};

/**
 * ## Signup route
 */
const getSignupForm = function getSignupForm(_req: Request, res: Response) {
  // res.status(statusCodes.ok).render('signup', {
  res.status(statusCodes.ok).render('signup', {
    title: 'Natour | Signup for a new account',
  });
};

const getMePage = function getMePage(
  _req: Request,
  res: Response
  // next: NextFunction
) {
  /**
   * ## No need, we use protectRoute middleware to check
   */
  // if (!res.locals.user) return next(new AppError('You are not logged in', 401));

  res.status(statusCodes.ok).render('account', {
    title: 'Natour | Your account',
    /**
     * ## we assing res.locals.user in the protectRoute middleware and isLoggedin middleware
     */
    // user: req.user,
  });
};

/**
 * update user data, takes input from user using the form
 *
 * @async
 * @param req - express request, contains the document in req.user from the protectRoute middleware
 * @param res - express response
 * @param _next - express next function
 * @returns {Promise<void>} - returns void, redirects to /me
 */
const updateUserData = catchAsync(async function updateUserData(
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  /**
   * ## TODO:
   * SEC: sanitize user input??
   */
  const { name, email } = req.body;
  // console.log(req.body);

  // if (false) {
  const user = req.user as mongoose.Document;
  // const updatedUser = await user.updateOne(
  await user.updateOne(
    { name, email },
    {
      runValidators: true,
      new: true,
    }
  );
  // }
  // console.log('updating user data', req.body);
  res.status(statusCodes.temporaryRedirect).redirect('/me');
});

/**
 * ## Self implemented but doesn't render anything, returns json only
 */
const getMyBookings = catchAsync(async function getMyBookings(
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  /**
   * SOLUTION 1:
   * ## find all bokings beloinging to user
   * ## find tours with the returned ids
   */

  /**
   * SOLUTION 2: virtual pop get tours directly
   * ## we still need to populate virtual properties
   */
  // const tours = await Tour.find().select('bookings').populate('bookings');

  /**
   * ## SOLUTION 3:
   * manually doing it, still needs 2 queries
   */

  // each booking has a user id
  // query by the user id
  const bookings = await Booking.find({ user: req.user?.id });

  // bookings only gives us tour ids [tourid1, tourid2]
  // create array of all the tour ids
  // query for tours that have 1 of these ids: tours where tourid is in one of [tourid1, tourid2]
  const tourIds = bookings.map((element) => element.tour.id);

  // get the tour corresponding to the tour id
  // new operator, can't use findbyid
  // IN OPERATOR
  // select all the tours which have an id which is IN the tourIDS array
  const tours = await Tour.find({ _id: { $in: tourIds } });

  /**
   * ## render the page
   */
  res.status(statusCodes.ok).render('overview', {
    title: 'My Tours | My Tours',
    tours,
  });
});

/**
 * @description:
 * this function sets an alert prop in the res.locals for every request
 * if it's present on a views query /?alert=booking
 * to be used by pug templates like base.pug to display a booking confirmation message
 * body(data-alert=alert)
 */
const alertParser = function alertParser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { alert } = req.query;
  if (!alert) {
    next();
    return;
  }

  const alertTypeSwitch = {
    booking:
      'Your booking was successful! Please check your email for a confirmation. If your booking does not show up here immediatly, please come back later.',
  };

  if (!Object.keys(alertTypeSwitch).includes(alert as string)) {
    next();
    return;
  }

  res.locals.alert = alertTypeSwitch[alert as keyof typeof alertTypeSwitch];

  next();
};

export {
  alertParser,
  getLoginForm,
  getMePage,
  getMyBookings,
  getSignupForm,
  getViewsOverview,
  getViewsRoot,
  getViewsTour,
  updateUserData,
};
