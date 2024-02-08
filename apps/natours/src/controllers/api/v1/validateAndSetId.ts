import express from 'express';
import mongoose from 'mongoose';
import isMongoId from 'validator/lib/isMongoId';

import { AppError, catchAsync, statusCodes } from '../../../helpers';

/**
 * @description validates the id of a document and sets the correct ID to the req.params.idName propr
 * will save the document to req.documents.ModelName
 */
const validateAndSetIdAndDocument = function validateAndSetId(
  // Model: mongoose.Model<any>,
  // idName: string
  {
    Model,
    idName,
    setDocument = false,
  }: {
    /**
     * ## @description
     * the mongooseDocument
     */
    Model: mongoose.Model<any>;
    /**
     * @description the name of the id in the params
     */
    idName: string;
    /**
     * @description if true will set the document to req.documents.ModelName
     */
    setDocument: boolean;
  }
) {
  return catchAsync(async function validateAndSet(
    req: express.Request,
    _: express.Response,
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

    // console.log('validateAndSetIdAndDocument, findById exec');

    const mongooseDocument = await Model.findById(id);

    // eslint-disable-next-line no-underscore-dangle
    if (!mongooseDocument) {
      return next(
        new AppError(`${modelName} ${id} doesnt't exist`, statusCodes.notFound)
      );
    }

    if (setDocument) {
      req.documents ??= {};
      // eslint-disable-next-line security/detect-object-injection
      req.documents[modelName] = mongooseDocument;
    }

    next();
  });
};

export { validateAndSetIdAndDocument };
