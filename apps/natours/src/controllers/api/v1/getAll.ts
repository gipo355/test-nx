import type express from 'express';
import type mongoose from 'mongoose';

import { APIFeaturesJonas, catchAsync, statusCodes } from '../../../helpers';

/**
 * @description
 * this function is a factory function that returns a function that gets all documents from a mongoose model. it will fetch all model docs filtering by the ID provided
 * the ID can either be in the body or in the params. params takes precedence
 *
 *
 * params idName and nestedModelName are optional and if undefined, it will search for
 * req.params.tourId
 * or req.params.userId
 */
const getAll = function getAll({
  /**
   * ## @param {mongoose.Model<any>} Model - the mongoose model to fetch the document from
   */
  Model,
  /**
   * @param {string} idName - the name of the id to filter by (e.g. tourId)
   */
  idName,
  nestedModelName,
}: {
  Model: mongoose.Model<any>;
  idName?: string;
  /**
   * @param {string} nestedModelName - the name of the nested model to filter by (e.g. tourId)
   * @description this is used to filter by a previous id in the query (example: get all reviews for
   * a specific tour)
   * natours.com/api/v1/tours/tourId/reviews
   */
  nestedModelName?: string;
}) {
  return catchAsync(async function getAllReviews(
    req: express.Request,
    res: express.Response
  ) {
    /**
     * ## @IMP: I WAS MUTATING THE REFERENCE WHEN REASSIGNING A PARAM
     * ## SO I HAD TO CREATE A NEW VARIABLE moduleName
     */

    /**
     * ## add tourId filter if it exists
     */

    /**
     * ## set the id from req.params.tourId if exists
     */
    // eslint-disable-next-line security/detect-object-injection
    let requestParameterId = idName && req.params[idName]; // if undefined, stops at the first falsey value and prevents checking req.params
    // const bodyIdName = `${Model.modelName.toLowerCase()}`;
    let moduleName = nestedModelName && nestedModelName.toLowerCase();

    /**
     * ## fix th case where a single controller must handle 2 possible filters
     * FOR PARAMS
     * example: get all bookings for a specific tour or user
     * natours.com/api/v1/tours/tourId/bookings
     * natours.com/api/v1/users/userId/bookings
     */

    if (
      !idName &&
      !nestedModelName &&
      (!req.body || Object.keys(req.body).length === 0) &&
      req.params &&
      Object.keys(req.params).length > 0
    ) {
      const [key, value] = Object.entries(req.params).filter(Boolean).flat();
      requestParameterId = value;
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      moduleName = key.split('Id')[0];
    }

    /**
     * ## fix th case where a single controller must handle 2 possible filters
     * FOR BODY
     * example: get all bookings for a specific tour or user
     * natours.com/api/v1/bookings
     * req.body.tour = tourId
     * req.body.user = userId
     */
    if (
      !nestedModelName &&
      !idName &&
      (!req.params || Object.keys(req.params).length === 0) &&
      req.body &&
      Object.keys(req.body).length > 0
    ) {
      const [key] = Object.keys(req.body);

      // eslint-disable-next-line no-param-reassign
      moduleName = key;
    }

    /**
     * ## get the nested filter name if exists (filter by tour on /tourId/reviews)
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filterByName = `${moduleName}`;

    /**
     * ## set the id from req.body.tour if exists, otherwise use the id from req.params.tourId
     */
    // eslint-disable-next-line security/detect-object-injection
    const bodyId = req.body[filterByName] ?? requestParameterId;

    // const { tour } = req.body;
    /**
     * ## implement previous features
     * allow nested GET reviews on tour
     * if tourId exists, filter by tourId
     */
    const features = new APIFeaturesJonas(
      Model.find({
        /**
         * ## filters by id selectively.
         * the id changes depending on the modelName (review, tour, user)
         * take the name to filter with from the nestedModelName param
         * if id(in req.params.tourId) exists, filter by id {tour: 'id'} and exits
         * if id(in req.body.tour) exists, filter by the body ID {tour: 'id'}
         * if none, show all results
         */
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        ...((requestParameterId && {
          [filterByName]: requestParameterId,
        }) ||
          (bodyId && { [filterByName]: bodyId })),
        // ...(id && { [bodyIdName]: id }),
        // ...(bodyId && { [bodyIdName]: bodyId }),
      }),
      req.query
    );
    features.filter().sort().limitFields().paginate();

    // get filtered reviews
    // TODO: remove _id and __v from response
    // const documents = await features.mongooseQuery.explain(); // this will show __v and _id
    const documents = await features.mongooseQuery;

    // send response
    res.status(statusCodes.ok).json({
      status: 'success',
      results: documents.length,
      data: {
        [`${Model.modelName.toLowerCase()}s`]: documents,
      },
    });
  });
};

export { getAll };
