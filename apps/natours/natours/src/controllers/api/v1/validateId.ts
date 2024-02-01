import express from 'express';
import type mongoose from 'mongoose';
import isMongoId from 'validator/lib/isMongoId';

import { AppError, catchAsync, statusCodes } from '../../../helpers';

const validateId = function validateId(
  idName: string,
  Model: mongoose.Model<any>
) {
  return catchAsync(async function validateTourId(
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) {
    // eslint-disable-next-line security/detect-object-injection
    const id = req.params[idName];
    const { modelName } = Model;

    /**
     * ## validation happens on the model
     */
    if (!isMongoId(id))
      return next(
        new AppError(
          `${modelName} id ${id} is not a valid ID`,
          statusCodes.badRequest
        )
      );

    /**
     * ## Model exists doesn't allow custo errors
     */
    // const isIdValid = await Model.exists({ _id: id });

    const mongooseDocument = await Model.findById(id);

    if (!mongooseDocument) {
      return next(
        new AppError(`${modelName} ${id} doesnt't exist`, statusCodes.notFound)
      );
    }

    next();
  });
};

export { validateId };
