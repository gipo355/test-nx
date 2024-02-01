import type express from 'express';
import type mongoose from 'mongoose';

import { catchAsync, statusCodes } from '../../../helpers';
// import { Review } from '../../../models';

const createOne = function createOne({
  Model,
  idName,
  nestedModelName,
  execute,
}: {
  Model: mongoose.Model<any>;
  /**
   * @description
   * ## idName is the name of the id in the params
   * example: /tours/:tourId/reviews (tourId is in the params)
   * either this or the nestedModelName is required
   */
  idName?: string;
  /**
   * @description
   * ## nestedModelName is the name of the nested model in the parent model
   * we need this to get the parent model id from the body if it is not in the params
   * example: /reviews (tour id is in the body)
   */
  nestedModelName?: string;
  execute?: (...callbackArguments: any[]) => any;
}) {
  return catchAsync(async function returned(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (typeof execute === 'function')
      /**
       * ## we execute the callback function if it exists and pass it the arguments ( like event listeners)
       */
      execute(req, res, next, {
        Model,
        idName,
        nestedModelName,
      });
    /**
     * ## We need to accept those possibilities:
     * 1. /tours/:tourId/reviews (tour id is in the params)
     * 2. /reviews (with req.body.tour) (tour id is in the body)
     * 3. /tours
     */

    // const { review: reviewInput, rating } = req.body;
    // tour id is already set by the validateAndSetTourId middleware even if in the body
    // const { tourId } = req.params; // already verified in the tourRouter
    // TODO: handle case where tourId is not in the params but in the body for /reviews

    // eslint-disable-next-line security/detect-object-injection
    if (nestedModelName && idName) {
      /**
       * ## if req.body.tour exists skip short circuit, else set it from req.params.tourId
       * if both don't exist, the validation will fail
       * if both exist, the req.body.tour will be used
       */

      req.body[nestedModelName.toLowerCase()] =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, security/detect-object-injection
        req.params[idName] ?? req.body[nestedModelName.toLowerCase()];

      // req.body[nestedModelName.toLowerCase()] ??= req.params[idName];
    }
    req.body.user = req.user?.id;

    /**
     * ## we do validation in its own middleware (validateId)
     */
    // const isTourID = await Tour.exists({ _id: tourId });

    // if (!isTourID)
    //   return next(new AppError(`Tour ${tourId} not found`, statusCodes.notFound));

    /**
     * ## VALIDATIONS
     * ## split into two if statements: separate embedded documents validation
     * we don't need them, validation happens in the model
     */
    // if (!reviewInput || !rating)
    //   return next(
    //     new AppError('Review and rating are required', statusCodes.badRequest)
    //   );
    // if (!tour)
    //   return next(new AppError('Tour is required', statusCodes.badRequest));

    /**
     * ## SANITIZATION
     * we don't need to sanitize the IDs, they happen in the model and must be correct mongoDB IDs
     */

    // TODO: sanitize the inputs? how to do it when you don't know the fields?

    const newDocument = await Model.create(req.body);

    /**
     * ## send each field individually to prevent sending _id and __v
     */

    res.status(statusCodes.created).send({
      status: 'success',
      data: {
        [Model.modelName]: newDocument,
      },
    });
  });
};

export { createOne };
