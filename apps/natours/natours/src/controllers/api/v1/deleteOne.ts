import express from 'express';
import mongoose from 'mongoose';

import { catchAsync, statusCodes } from '../../../helpers';

const deleteOne = function deleteOne({
  Model,
  idName,
}: {
  Model: mongoose.Model<any>;
  idName: string;
}) {
  return catchAsync(async function subFunction(
    req: express.Request,
    res: express.Response
  ) {
    // TODO: change from specific reviewId to generic id the other controllers and routes
    // TODO: make validateOwnership an external factory function
    // TODO: make validateAndSetDocId an external factory function
    // validateId(tourrouter) and validateAndSetReviewId + validateAndSetTourID(reviewRouter) must be joined
    // eslint-disable-next-line security/detect-object-injection
    const id = req.params[idName];

    const document = await Model.findByIdAndDelete(id);

    // BUG: doesn't trigger post hooks for findByIdAndDelete
    // am forced to put it here

    /**
     * ## need to recalculate the average ratings
     */
    if (Model.modelName === 'Review') {
      // FIX: bad typescript implementation ( Model has no prop calcAverageRatings )
      const customModel = Model as any;
      await customModel.calcAverageRatings(document.tour);
    }

    res.status(statusCodes.noContent).send({
      status: 'success',
      // eslint-disable-next-line unicorn/no-null
      data: null,
    });
  });
};

export { deleteOne };
