import express from 'express';
import mongoose from 'mongoose';

import { AppError, catchAsync, statusCodes } from '../../../helpers';

const patchOne = function patchOne({
  Model,
  idName,
}: {
  Model: mongoose.Model<any>;
  idName: string;
}) {
  return catchAsync(async function returnedFunction(
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) {
    let mongooseDocument;
    /**
     * ## verify if the document was set in the req.documents object by a previous middleware
     */
    if (req.documents?.[Model.modelName])
      mongooseDocument = req.documents[Model.modelName];
    if (mongooseDocument === undefined) {
      // eslint-disable-next-line security/detect-object-injection
      const id = req.params[idName];
      mongooseDocument = await Model.findById(id);
    }

    if (!mongooseDocument)
      return _next(
        new AppError(
          `${Model.modelName.toLowerCase()} ${
            // eslint-disable-next-line security/detect-object-injection
            req.params[idName]
          } doesnt't exist`,
          statusCodes.notFound
        )
      );

    // TODO: sanitization
    mongooseDocument.set(req.body);

    // validators run on save and create, not on update
    await mongooseDocument.save();

    res.status(statusCodes.ok).send({
      status: 'success',
      data: {
        [Model.modelName.toLowerCase()]: mongooseDocument,
      },
    });
  });
};

export { patchOne };
