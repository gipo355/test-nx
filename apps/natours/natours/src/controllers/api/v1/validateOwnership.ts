import express from 'express';
import type mongoose from 'mongoose';

import { AppError, catchAsync, statusCodes } from '../../../helpers';

/**
 * ## @description
 * this functions checks already setted req.user (from protectRoute middlewate) and req.documents.ModelName documents to see if the user is the owner of the review or an admin
 * @requires protectRoute and validateAndSetIdAndDocument to be called before this function
 * @param {mongoose.Model<any>} Model - the mongoose model to fetch the document from (e.g. req.documents.Review)
 */
const validateOwnership = function validateOwnership({
  Model,
  idName,
}: {
  Model: mongoose.Model<any>;
  idName: string;
}) {
  return catchAsync(async function anon(
    req: express.Request,
    _: express.Response,
    next: express.NextFunction
  ) {
    const { user } = req;
    // eslint-disable-next-line unicorn/consistent-destructuring
    let mongooseDocument = req.documents[Model.modelName];
    if (mongooseDocument === undefined) {
      // eslint-disable-next-line security/detect-object-injection, unicorn/consistent-destructuring
      mongooseDocument = await Model.findById(req.params[idName]);
    }

    if (user?.id !== mongooseDocument?.user?.id && user?.role !== 'admin')
      return next(
        new AppError(
          'You are not the owner of this review!',
          statusCodes.forbidden
        )
      );

    return next();
  });
};

export { validateOwnership };
