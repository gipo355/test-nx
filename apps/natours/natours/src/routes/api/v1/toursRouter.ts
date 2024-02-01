/* eslint-disable spellcheck/spell-checker */
import { Router } from 'express';

import { IS_IMAGEKIT_ENABLED } from '../../../config';
// import { CSRF_ENABLED } from '../../../config';
import {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getDistances,
  getMonthlyPlan,
  getTour,
  getTourStats,
  getToursWithin,
  patchTour,
  protectRoute,
  resizeTourImages,
  restrictTo,
  unsupportedMethodHandler,
  uploadToImgKit,
  uploadTourImages,
  validateAndSetIdAndDocument,
} from '../../../controllers';
import { doubleCsrfProtection } from '../../../helpers';
import { Tour } from '../../../models';
import { bookingsRouterV1 } from './bookingsRouter';
import { reviewRouterV1 } from './reviewRouter';
// import { Logger } from '../../../loggers';

const router = Router();

// example of params
// router.param('id', (_req, _res, next, value) => {
//     Logger.debug(`tour id is: ${value}`);
//     next();
// });

// router.use(middleware); // middleware works on all routes

// ! implementing aliasing
// we still want all the tours, but with a query string present
// my solution
// router.route('/top-5-cheap').get(async (req, res) => {
//     // req.query = '?limit=5&sort=-ratingsAverage,price';
//     req.query = { limit: '5', sort: '-ratingsAverage,price' };
//     await getAllTours(req, res);
// });
// ! jonas solution

/**
 * ## Nested Routes
 * Reviews with tour ID
 */

/**
 * ## Tour ID validation for all subroutes (DRY)
 * Redirect all subroutes to reviewRouterV1
 * IMP: we move this above the  protection because it's already in the reviewRouterV1
 * we don't want to double validate
 */
router.use(
  '/:tourId/reviews',
  validateAndSetIdAndDocument({
    idName: 'tourId',
    Model: Tour,
    setDocument: true,
  }),
  reviewRouterV1
);

/**
 * ## redirect to bookingsRouterV1 to filter bookings by tourId
 */
router.use(
  '/:tourId/bookings',
  validateAndSetIdAndDocument({
    idName: 'tourId',
    Model: Tour,
    setDocument: false,
  }),
  bookingsRouterV1
);

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
// if (CSRF_ENABLED) router.use(doubleCsrfProtection);
// router.use('/', protectRoute); // protect all routes under /tour

/**
 * @openapi
 * /tours/top-5-cheap:
 *   tags:
 *    - tours
 *   description: returns all tours
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: app is up and running
 */
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

/**
 * ## Global route
 */
router
  .route('/')
  // .get(protectRoute, getAllTours)
  /**
   * @openapi
   * /tours:
   *  get:
   *   tags:
   *    - tours
   *   description: returns all tours
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    200:
   *     description: app is up and running
   */
  .get(getAllTours)
  /**
   * @openapi
   * /tours:
   *  post:
   *   tags:
   *    - tours
   *   description: returns all tours
   *   parameters:
   *    - in: header
   *      name: csrf token
   *      description: csrf token provided upon login or signup
   *      schema:
   *       type: string
   *       required: true
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    200:
   *     description: app is up and running
   */
  .post(
    doubleCsrfProtection,
    protectRoute,
    restrictTo('admin', 'lead-guide'),
    createTour
  )
  /**
   * @openapi
   * /tours:
   *  put:
   *   tags:
   *    - tours
   *   description: returns all tours
   *   parameters:
   *    - in: header
   *      name: csrf token
   *      description: csrf token provided upon login or signup
   *      schema:
   *       type: string
   *       required: true
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    200:
   *     description: app is up and running
   */
  .put(unsupportedMethodHandler); // middleware works on get route  IMPORTANT: doesn't work for subroute get method

/**
 * @openapi
 * /tours/tour-stats:
 *  get:
 *   tags:
 *    - tours
 *   description: returns all tours
 *   parameters:
 *    - in: header
 *      name: csrf token
 *      description: csrf token provided upon login or signup
 *      schema:
 *       type: string
 *       required: true
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: app is up and running
 */
router.route('/tour-stats').get(getTourStats);

/**
 * @openapi
 * /tours/tours-within/{distance}/center/{latlng}/unit/{unit}:
 *  get:
 *   tags:
 *    - tours
 *   description: find tours withint a specified distance
 *   parameters:
 *    - in: header
 *      name: csrf token
 *      description: csrf token provided upon login or signup
 *      schema:
 *       type: string
 *       required: true
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: app is up and running
 */
/**
 * ## possible ways
 * use query url with params /tours-within/:distance/center/:latlng/unit/:unit
 * user query string /tours-within?distance=233&center=-40,45&unit=mi
 */
// router.route('/tours-within').get(getToursWithin);
/**
 * ## never seen before way of specifying query url
 * this way its cleaner for jonas, standard way of specifying a url that contains a lot of objects
 */
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

/**
 * @openapi
 * /tours/distances/{latlng}/unit/{unit}:
 *  get:
 *   tags:
 *    - tours
 *   description: get all tour distances from a point
 *   parameters:
 *    - in: header
 *      name: csrf token
 *      description: csrf token provided upon login or signup
 *      schema:
 *       type: string
 *       required: true
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: app is up and running
 */
// router.route('/tours-within').get(getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(getDistances);

/**
 * @openapi
 * /tours/tour-stats/monthly-plan/{year}:
 *  get:
 *   tags:
 *    - tours
 *   description: returns all tours
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: app is up and running
 */
router
  .route('/tour-stats/monthly-plan/:year')
  .get(
    doubleCsrfProtection,
    protectRoute,
    restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
  ); // if year, show year else show per every year

/**
 * ## Subroute: Tour ID
 */
// router.use('/:id', middlewareSpecificSubResource); // middlware works on all :id route
router
  .route('/:id')
  /**
   * @openapi
   * /tours/{id}:
   *  get:
   *   tags:
   *    - tours
   *   description: returns all tours
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    200:
   *     description: app is up and running
   */
  .get(getTour) // middlware works on get :id route
  /**
   * @openapi
   * /tours/{id}:
   *  patch:
   *   tags:
   *    - tours
   *   description: returns all tours
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    200:
   *     description: app is up and running
   */
  .patch(
    doubleCsrfProtection,
    protectRoute,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    // resizeTourImages,
    // uploadToImgKit,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    IS_IMAGEKIT_ENABLED ? uploadToImgKit : resizeTourImages,
    patchTour
  )
  /**
   * @openapi
   * /tours/{id}:
   *  delete:
   *   tags:
   *    - tours
   *   description: returns all tours
   *   parameters:
   *    - in: header
   *      name: csrf token
   *      description: csrf token provided upon login or signup
   *      schema:
   *       type: string
   *       required: true
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    200:
   *     description: app is up and running
   */
  .delete(
    doubleCsrfProtection,
    protectRoute,
    restrictTo('admin', 'lead-guide'),
    deleteTour
  )
  /**
   * @openapi
   * /tours/{id}:
   *  put:
   *   tags:
   *    - tours
   *   description: returns all tours
   *   parameters:
   *    - in: header
   *      name: csrf token
   *      description: csrf token provided upon login or signup
   *      schema:
   *       type: string
   *       required: true
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    200:
   *     description: app is up and running
   */
  .put(unsupportedMethodHandler);

export { router as toursRouterV1 };
