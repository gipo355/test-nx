/* eslint-disable spellcheck/spell-checker */
import { Router } from 'express';

import { CSRF_ENABLED } from '../../../config';
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  getCheckoutSession,
  protectRoute,
  restrictTo,
  unsupportedMethodHandler,
  updateBooking,
} from '../../../controllers';
import { AppError, doubleCsrfProtection, statusCodes } from '../../../helpers';
// import { Logger } from '../../../loggers';

// TODO: change all routes for reviews

const router = Router({
  /**
   * ## Nested routes
   * we can get the tourId from /tours/:tourId/bookings
   */
  mergeParams: true, // mergeParams: true allows us to access the params from the parent router
});

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (CSRF_ENABLED) router.use(doubleCsrfProtection);
router.use('/', protectRoute); // protect all routes under /bookings

/**
 * ## ensure the user is saved in the req.user. we need the ID added by the protect route middleware
 */
router.use((req, _, next) => {
  if (!req.user?.id)
    return next(
      new AppError(
        'There was an error, please login again',
        statusCodes.internalServerError
      )
    );
  return next();
});

/**
 * ## IMP: we are not going to follow the rest principle here
 *
 * this is not about creating getting any bookings
 * only used by the client to get a checkout session
 */
/**
 * @openapi
 * /checkout-session/{tourId}/:
 *  get:
 *   tags:
 *    - bookings
 *   description: create a checkout session
 *   requestBody:
 *    description: The new properties to update for the review
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/createReviewRequestBody'
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    201:
 *     description: created review
 */
router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(restrictTo('admin', 'lead-guide'));

/**
 * ## get all bookings
 * can come from
 * /tours/:tourId/bookings
 * /users/:userId/bookings
 * /bookings
 * gets param tourId from tourRouter
 */
/**
 * @openapi
 * /bookings:
 *  get:
 *   tags:
 *    - bookings
 *   description: find all bookings
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: success
 */
/**
 * @openapi
 * /tours/{tourId}/bookings:
 *  get:
 *   tags:
 *    - bookings
 *   description: find all bookings for a tour
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: success
 */
/**
 * @openapi
 * /users/{userId}/bookings:
 *  get:
 *   tags:
 *    - bookings
 *   description: find all bookings for a user
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: success
 */
router
  .route('/')
  .get(getAllBookings)
  /**
   * @openapi
   * /bookings/{tourId}:
   *  post:
   *   tags:
   *    - bookings
   *   description: create a booking - admin only
   *   requestBody:
   *    description: The new properties to create for the review
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/components/schemas/Booking'
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    200:
   *     description: created review
   */
  .post(createBooking);

/**
 * ## can come from
 * /api/v1/bookings/:id
 */
router
  .route('/:id')
  /**
   * @openapi
   * /bookings/{tourId}:
   *  get:
   *   tags:
   *    - bookings
   *   description: get a booking
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    200:
   *     description: success
   */
  .get(getBooking)
  /**
   * @openapi
   * /bookings/{tourId}:
   *  patch:
   *   tags:
   *    - bookings
   *   description: update a booking - admin only
   *   requestBody:
   *    description: The new properties to update for the review
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/components/schemas/Booking'
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    200:
   *     description: created review
   */
  .patch(restrictTo('admin'), updateBooking)
  /**
   * @openapi
   * /bookings/{tourId}:
   *  delete:
   *   tags:
   *    - bookings
   *   description: delete a booking - admin only
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    204:
   *     description: deleted
   */
  .delete(restrictTo('admin'), deleteBooking);

// catch all remaining unsupported methods under /bookings
router.use(unsupportedMethodHandler);

export { router as bookingsRouterV1 };
