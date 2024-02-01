/* eslint-disable spellcheck/spell-checker */
import { Router } from 'express';

import { CSRF_ENABLED } from '../../../config';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  protectRoute,
  restrictTo,
  unsupportedMethodHandler,
  updateReview,
  validateAndSetIdAndDocument,
  validateOwnership,
} from '../../../controllers';
import { AppError, doubleCsrfProtection, statusCodes } from '../../../helpers';
import { Review } from '../../../models';
// import { Logger } from '../../../loggers';

// TODO: change all routes for reviews

const router = Router({
  mergeParams: true, // mergeParams: true allows us to access the params from the parent router
});

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (CSRF_ENABLED) router.use(doubleCsrfProtection);
router.use('/', protectRoute); // protect all routes under /tour

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
  next();
});

/**
 * ## on this route we can get requests from
 * /tours/:tourId/reviews
 * /tours/:toourId/reviews/:reviewId
 * /reviews
 * /reviews/:reviewId
 */

/**
 * ## Nested route with no review ID
 * can be both coming from /reviews or /tours/:tourId/reviews
 */
router
  .route('/')
  /**
   * @openapi
   * /tours/{tourId}/reviews:
   *  post:
   *   tags:
   *    - reviews
   *   description: create a review
   *   parameters:
   *    - in: header
   *      name: csrf token
   *      description: csrf token provided upon login or signup
   *      schema:
   *       type: string
   *       required: true
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
  .post(restrictTo('user'), createReview)
  // .get(protectRoute, getAllTours)
  /**
   * @openapi
   * /tours/{tourId}/reviews:
   *  get:
   *   tags:
   *    - reviews
   *   description: returns all reviews
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    200:
   *     description: returns all reviews
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/GetReviews'
   */
  // .get(getAll({ Model: Review, idName: 'tourId', nestedModelName: 'tour' }))
  .get(getAllReviews)
  .put(unsupportedMethodHandler); // middleware works on get route  IMPORTANT: doesn't work for subroute get method

/**
 * ## Review ID validation for all subroutes (DRY)
 * Nested routes, single review ID specified
 * can be both coming from /reviews/:reviewId or /tours/:tourId/reviews/:reviewId
 */
router.use(
  '/:reviewId',
  validateAndSetIdAndDocument({
    Model: Review,
    idName: 'reviewId',
    setDocument: true,
  })
);

const reviewOptions = {
  Model: Review,
  idName: 'reviewId',
};
router
  .route('/:reviewId')
  /**
   * @openapi
   * /tours/{tourId}/reviews/{reviewId}:
   *  get:
   *   tags:
   *    - reviews
   *   description: returns a review
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    200:
   *     description: returns a review
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/GetReview'
   */
  .get(getReview) // middlware works on get :id route
  //
  /**
   * @openapi
   * /tours/{tourId}/reviews/{reviewId}:
   *  patch:
   *   tags:
   *    - reviews
   *   description: update a review
   *   parameters:
   *    - in: header
   *      name: csrf token
   *      description: csrf token provided upon login or signup
   *      schema:
   *       type: string
   *       required: true
   *   security:
   *    - bearerAuth: []
   *   requestBody:
   *    description: The new properties to update for the review
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/components/schemas/UpdateReviewRequestBody'
   *   responses:
   *    200:
   *     description: updated review
   */
  .patch(
    restrictTo('user', 'admin'),
    validateOwnership(reviewOptions),
    updateReview
  )
  //
  /**
   * @openapi
   * /tours/{tourId}/reviews/{reviewId}:
   *  delete:
   *   tags:
   *    - reviews
   *   description: delete a review
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
   *    204:
   *     description: deleted review
   */
  // .delete(validateOwnership(reviewOptions), deleteOne(reviewOptions)) // already restricted to review owner and admin in the controller
  .delete(
    restrictTo('user', 'admin'),
    validateOwnership(reviewOptions),
    deleteReview
  ) // already restricted to review owner and admin in the controller
  //
  .put(unsupportedMethodHandler);

// catch all remaining unsupported methods
router.use(unsupportedMethodHandler);

export { router as reviewRouterV1 };
