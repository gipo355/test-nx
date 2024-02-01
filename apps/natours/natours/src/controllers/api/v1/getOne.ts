import type express from 'express';
import type mongoose from 'mongoose';

import { AppError, catchAsync, statusCodes } from '../../../helpers';

const getOne = function getOne({
  Model,
  idName,
  populateOptions,
}: {
  Model: mongoose.Model<any>;
  idName: string;
  populateOptions?: string;
}) {
  return catchAsync(async function returnedFunction(
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) {
    /**
     * ## HOW DO WE HANDLE THE P{ path: 'reviews' },OPULATE?
     */
    /**
     * ## check if the document was set in the req.documents object by a previous middleware
     * to prevent multople database calls
     */

    let mongooseDocument;
    if (req.documents?.[Model.modelName])
      mongooseDocument = req.documents[Model.modelName];
    if (mongooseDocument === undefined && idName) {
      // eslint-disable-next-line security/detect-object-injection
      const id = req.params[idName];
      /**
       * ## Not sure if i have to await here
       * but in the case of req containing the document, it's already awaited
       */
      mongooseDocument = await Model.findById(id);
    }
    if (populateOptions) {
      /**
       * ## if yes, populate the document, we need to await the document
       * because populate is a query and we need to await the query
       */
      await mongooseDocument.populate(populateOptions);
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

    /**
     * ## if not, fetch the document from the database
     */

    // NON BLOCKING ( it blocks the pool event loop )
    // void poolProxy.testFibonacci(46);
    // void poolProxy.testFibonacci(50);
    // void poolProxy.testFibonacci(50);
    // void poolProxy.testFibonacci(50);
    // void poolProxy.testFibonacci(50);

    return res.status(statusCodes.ok).send({
      status: 'success',
      data: {
        [Model.modelName.toLowerCase()]: mongooseDocument,
      },
    });
  });
};

export { getOne };
