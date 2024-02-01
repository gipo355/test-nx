/* eslint-disable no-underscore-dangle */

import { Review } from '../../../models';
import { createOne } from './createOne';
import { deleteOne } from './deleteOne';
import { getAll } from './getAll';
import { getOne } from './getOne';
import { patchOne } from './patchOne';

const reviewOptions = {
  Model: Review,
  idName: 'reviewId',
};

// import express from 'express';

// import {
//   APIFeaturesJonas,
//   AppError,
//   catchAsync,
//   sanitizeReview,
//   statusCodes,
// } from '../../../helpers';
// import { Review, Tour } from '../../../models';

// TODO: break each function into its own file ( also the other controllers )
// TODO: DRY repeated sections (e.g. validation, response, etc.)

// const validateAndSetReviewId = catchAsync(async function validateAndSetReviewId(
//   req: express.Request,
//   _: express.Response,
//   next: express.NextFunction
// ) {
//   const { reviewId } = req.params;
//   const reviewDocument = await Review.findById(reviewId);
//   if (!reviewDocument?.id)
//     return next(
//       new AppError(`Review ${reviewId} doesn't exist`, statusCodes.notFound)
//     );

//   // eslint-disable-next-line require-atomic-updates
//   req.Review = reviewDocument;

//   next();
// });

/**
 * ## @description
 * this functions checks already setted req.user and req.Review documents to see if the user is the owner of the review
 * @requires protectRoute and validateAndSetReviewId to be called before this function
 */
// const validateReviewOwnership = function validateReviewOwnership(
//   req: express.Request,
//   _: express.Response,
//   next: express.NextFunction
// ) {
//   const { user } = req;
//   const { Review: ReviewDocument } = req;
//   if (user?.id !== ReviewDocument?.user?.id)
//     return next(
//       new AppError(
//         'You are not the owner of this review!',
//         statusCodes.forbidden
//       )
//     );

//   return next();
// };

// const validateAndSetTourId = catchAsync(async function validateAndSetTourId(
//   req: express.Request,
//   _: express.Response,
//   next: express.NextFunction
// ) {
//   const { tour } = req.body;
//   const { tourId } = req.params; // already verified in the tourRouter
//   // tour ID can not exist if it comes from /reviews
//   // in this case we need to get it from the body and validate the ID
//   // in case it's wrong we want to error handle it
//   if (tourId) return next();

//   // prevent making a useless db call
//   if (!tourId && !tour)
//     return next(new AppError('A Tour is required', statusCodes.badRequest));
//   // validate
//   // we don't need to validate :tourId, it's already done in the tourRouter
//   const tourDocument = await Tour.findById(tour);
//   if (!tourDocument)
//     return next(
//       new AppError(`Tour ${tour} doesn't exist`, statusCodes.badRequest)
//     );
//   // eslint-disable-next-line require-atomic-updates
//   req.params.tourId = tourDocument.id;

//   return next();
// });

const getAllReviews = getAll({
  Model: Review,
  idName: 'tourId',
  nestedModelName: 'tour',
});

// const getAllReviews = catchAsync(async function getAllReviews(
//   req: express.Request,
//   res: express.Response
// ) {
//   /**
//    * ## add tourId filter if it exists
//    */
//   const { tourId } = req.params;
//   const { tour } = req.body;
//   /**
//    * ## implement previous features
//    * allow nested GET reviews on tour
//    * if tourId exists, filter by tourId
//    */
//   const features = new APIFeaturesJonas(
//     Review.find({
//       ...(tourId && { tour: tourId }),
//       ...(tour && { tour }),
//     }),
//     req.query
//   );
//   features.filter().sort().limitFields().paginate();

//   // get filtered reviews
//   // TODO: remove _id and __v from response
//   const reviews = await features.mongooseQuery; // this will show __v and _id

//   // send response
//   res.status(statusCodes.ok).send({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

const createReview = createOne({
  Model: Review,
  idName: 'tourId',
  nestedModelName: 'tour',
});
// const createReview = catchAsync(async function createReview(
//   req: express.Request,
//   res: express.Response
// ) {
//   const { review: reviewInput, rating } = req.body;
//   // tour id is already set by the validateAndSetTourId middleware even if in the body
//   const { tourId } = req.params; // already verified in the tourRouter
//   // TODO: handle case where tourId is not in the params but in the body for /reviews

//   /**
//    * ## we do validation in its own middleware (validateId)
//    */
//   // const isTourID = await Tour.exists({ _id: tourId });

//   // if (!isTourID)
//   //   return next(new AppError(`Tour ${tourId} not found`, statusCodes.notFound));

//   /**
//    * ## VALIDATIONS
//    * ## split into two if statements: separate embedded documents validation
//    * we don't need them, validation happens in the model
//    */
//   // if (!reviewInput || !rating)
//   //   return next(
//   //     new AppError('Review and rating are required', statusCodes.badRequest)
//   //   );
//   // if (!tour)
//   //   return next(new AppError('Tour is required', statusCodes.badRequest));

//   /**
//    * ## SANITIZATION
//    * we don't need to sanitize the IDs, they happen in the model and must be correct mongoDB IDs
//    */

//   const newReview = await Review.create({
//     review: sanitizeReview(reviewInput),
//     rating,
//     tour: tourId, // tour ID should be automatic in UI
//     user: req.user?.id, // the protectroute adds req.user to the req
//   });

//   /**
//    * ## send each field individually to prevent sending _id and __v
//    */

//   res.status(statusCodes.created).send({
//     status: 'success',
//     data: {
//       review: {
//         id: newReview.id,
//         createdAt: newReview.createdAt,
//         lastUpdatedAt: newReview.lastUpdatedAt,
//         review: newReview.review,
//         rating: newReview.rating,
//         tour: newReview.tour,
//         user: newReview.user,
//       },
//     },
//   });
// });

const getReview = getOne(reviewOptions); // middlware works on get :id route
// const getReview = function getReview(
//   req: express.Request,
//   res: express.Response
// ) {
//   // const { id, reviewId } = req.params;

//   // /**
//   //  * ## find review by IDs
//   //  * allow both tourId and id, allowing to use nested route and direct route
//   //  * if id exists, it means the req was done at /reviews/:id
//   //  * if tourId exists, it means the req was done at /tours/:tourId/reviews/:id
//   //  */
//   // // TODO: find not needed. only reviewId is provided after refactor. use findById
//   // const reviews = await Review.find({
//   //   ...(id && { _id: reviewId }),
//   //   ...(reviewId && { _id: reviewId }),
//   // }).lean();
//   // // find returns an array

//   // if (reviews.length === 0)
//   //   return next(
//   //     new AppError(`Review ${id || reviewId} not found`, statusCodes.notFound)
//   //   );

//   // req.review is set  by the validateId middleware
//   res.status(statusCodes.ok).send({
//     status: 'success',
//     data: {
//       review: req.Review,
//     },
//   });
// };

const updateReview = patchOne(reviewOptions);
// const patchReview = catchAsync(async function updateReview(
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) {
//   // const { id } = req.params;

//   // /**
//   //  * ## find review by id
//   //  * change the fields
//   //  * save with validators
//   //  * return the updated review
//   //  */
//   // const review = await Review.findById(id);

//   // const { id, reviewId } = req.params;

//   // /**
//   //  * ## find review by IDs
//   //  * allow both tourId and id, allowing to use nested route and direct route
//   //  * if id exists, it means the req was done at /reviews/:id
//   //  * if tourId exists, it means the req was done at /tours/:tourId/reviews/:id
//   //  */
//   // const reviews = await Review.find({
//   //   ...(id && { _id: reviewId }),
//   //   ...(reviewId && { _id: reviewId }),
//   // });

//   // const review = reviews[0];

//   // if (!review)
//   //   return next(new AppError(`Review ${id} not found`, statusCodes.notFound));

//   // req.Review is set by the validateId middleware
//   const review = req.Review;

//   if (review.user?.id !== req.user?.id && req.user?.role !== 'admin')
//     return next(
//       new AppError(
//         "This review doesn't belong to you!",
//         statusCodes.unauthorized
//       )
//     );

//   /**
//    * ## we don't want to use findByIdAndUpdate because we want to check if the
//    * user is the owner of the review before updating or saving
//    */

//   /**
//    * ## change only if present
//    */
//   review.review = req.body?.review ?? sanitizeReview(req.body.review);
//   review.rating = req.body?.rating ?? review.rating;

//   await review.save(); // runs validators automatically, only sepcify on update

//   res.status(statusCodes.ok).send({
//     status: 'success',
//     data: {
//       review,
//     },
//   });
// });

const deleteReview = deleteOne(reviewOptions);
// const deleteReview = catchAsync(async function deleteReview(
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) {
//   /**
//    * ## get the review
//    */
//   // const { id } = req.params;
//   // const review = await Review.findById(id);

//   // const { id, reviewId } = req.params;
//   // const reviews = await Review.find({
//   //   ...(id && { _id: reviewId }),
//   //   ...(reviewId && { _id: reviewId }),
//   // });

//   // const review = reviews[0];

//   // /**
//   //  * ## VALIDATIONS
//   //  * check if review exists
//   //  * check if user is the owner of the review or if user is admin
//   //  */

//   // if (!review)
//   //   return next(new AppError(`Review ${id} not found`, statusCodes.notFound));

//   const review = req.Review;

//   if (review.user?.id !== req.user?.id && req.user?.role !== 'admin')
//     return next(
//       new AppError(
//         "This review doesn't belog to you!",
//         statusCodes.unauthorized
//       )
//     );

//   await review.deleteOne({ _id: review.id });

//   res.status(statusCodes.noContent).send({
//     status: 'success',
//     // eslint-disable-next-line unicorn/no-null
//     data: null,
//   });
// });

export {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview,
  //   // validateAndSetReviewId,
  //   // validateAndSetTourId,
  //   // validateReviewOwnership,
};
