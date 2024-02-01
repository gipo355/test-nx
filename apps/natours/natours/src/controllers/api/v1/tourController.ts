// import { DEFAULT_LIMIT_PER_PAGE, DEFAULT_PAGE } from '../../../config';
// import { APIFeatures } from './APIFeatures';
import express from 'express';
import multer from 'multer';

import {
  AppError,
  autoResizeImage,
  // APIFeaturesJonas,
  // AppError,
  catchAsync,
  imagekit,
  statusCodes,
} from '../../../helpers';
// import { Logger } from '../../../loggers';
import { Tour } from '../../../models';
import { createOne } from './createOne';
import { deleteOne } from './deleteOne';
import { getAll } from './getAll';
import { getOne } from './getOne';
import { patchOne } from './patchOne';
import { validateOwnership } from './validateOwnership';

/**
 * ## MULTER - uploading and updating tour images
 */
const multerStorageInMemory = multer.memoryStorage();

/**
 * ## multerFilter
 */
const multerFilter = (_req: express.Request, file: any, callback: any) => {
  // const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  // eslint-disable-next-line unicorn/no-null
  callback(null, true);

  // if (allowedMimeTypes.includes(_req.file?.mimetype)) {
  if (file?.mimetype?.startsWith('image')) {
    // eslint-disable-next-line unicorn/no-null
    return callback(null, true);
  }

  return callback(
    new AppError(
      'Invalid file type. Only jpg, jpeg, png files are allowed',
      statusCodes.badRequest
    ),
    false
  );
};

const upload = multer({
  storage: multerStorageInMemory,
  fileFilter: multerFilter,
});

/**
 * ## uploading multiple images middleware ( instead of single)
 * non images will be put in req.body
 */
const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 }, // only 1 field can be named imageCover
  { name: 'images', maxCount: 3 },
]);

/**
 * ## trying with imagekit
 */
const uploadTourPhotosImagekit = catchAsync(
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.files) return next();

    const { imageCover, images } = req.files as Record<
      string,
      Express.Multer.File[] | undefined
    >;
    if (!imageCover || !images)
      return next(
        new AppError(
          'Please upload an image cover and images',
          statusCodes.badRequest
        )
      );

    /**
     * ## Deleting folders before uploading
     * we need to make sure this ends or we pollute the cdn
     */
    const imageCoverFolderPath = `${req.user?.id}/imageCover/`;
    const imagesFolderPath = `${req.user?.id}/images/`;
    // const folderPaths = [
    //   imageCoverFolderPath,
    //   imagesFolderPath,
    //   // `${req.user?.id}/imageCover/`,
    //   // `${req.user?.id}/images/`,
    // ];

    /**
     * ## we need trycatch block to avoid unhandled promise rejection when no folder exists
     * no action needed
     */
    try {
      // for await (const folderPath of folderPaths) {
      // eslint-disable-next-line no-restricted-syntax
      for await (const folderPath of [imageCoverFolderPath, imagesFolderPath]) {
        await imagekit?.deleteFolder(folderPath);
      }
      // eslint-disable-next-line no-empty
    } catch {}

    /**
     * ##
     * trying with only imageCover for now
     */

    /**
     * ## create filename
     */
    const imageCoverFilename = `tour-${
      req.params.id || req.body.id
    }-${Date.now()}-cover.jpeg`;

    /**
     * ## upload the image from req.files.imageCover[0]
     */
    const imgkitResponse = await imagekit?.upload({
      file: imageCover[0].buffer,
      // file: req.resizedImages?.resizedImageCover,
      // fileName: imageCoverFilename,
      fileName: `${imageCoverFilename}`,
      folder: imageCoverFolderPath,
    });

    if (!imgkitResponse) {
      return next(
        new AppError(
          'Something went wrong while uploading the image to imagekit',
          statusCodes.internalServerError
        )
      );
    }

    const imageCoverURL = imagekit?.url({
      // path: imgkitResponse.name,
      path: `${imageCoverFolderPath}${imgkitResponse.name}`,
      // the endpoint is defaulted to init
      transformation: [
        {
          height: '1333',
          width: '2000',
        },
      ],
    });
    // console.log(imageURL, 'imageURL');

    // eslint-disable-next-line require-atomic-updates
    req.body.imageCover = imageCoverURL;
    // req.body.imageCover = imgkitResponse.url;

    // TODO: delete previous versions of the image, maybe use a folder for user and type?

    // console.log(imgkitResponse, 'imkResponse');
    // console.log('imagekit');

    /**
     * ## save the url in the db
     * from the upload response?
     * storing it in the request
     */

    /**
     * ## Images
     */
    // eslint-disable-next-line require-atomic-updates
    req.body.images = [];
    await Promise.all(
      images.map(async (image: Express.Multer.File, index: number) => {
        if (!image)
          return next(
            new AppError(
              'Something went wrong while uploading an image',
              statusCodes.internalServerError
            )
          );

        const fileName = `tour-${req.params.id || req.body.id}-${Date.now()}-${
          index + 1
        }.jpeg`;

        // await autoResizeImage(image.buffer, fileName, {
        //   width: 2000,
        //   height: 1333,
        // });

        const imgkitImagesResponse = await imagekit?.upload({
          file: image.buffer,
          // file: req.resizedImages?.resizedImageCover,
          fileName,
          folder: imagesFolderPath,
        });

        if (!imgkitImagesResponse) {
          return next(
            new AppError(
              'Something went wrong while uploading the image to imagekit',
              statusCodes.internalServerError
            )
          );
        }

        const imageURL = imagekit?.url({
          // path: imgkitImagesResponse.name,
          path: `${imagesFolderPath}${imgkitImagesResponse.name}`,
          // the endpoint is defaulted to init
          transformation: [
            {
              height: '1333',
              width: '2000',
            },
          ],
        });

        req.body.images.push(imageURL);
      })
    );

    next();
  }
);

/**
 * ## if we didn't have image cover and only 1 field with multiple images or files at the same time
 */
// const uploadTourImagesSingle = upload.array('fieldName', 3);

/**
 * ## Processing images with sharp
 */
const resizeTourImages = catchAsync(async function resizeTourImages(
  _req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) {
  const { imageCover, images } = _req.files as Record<
    string,
    Express.Multer.File[] | undefined
  >;
  // if (!_req.files && !_req.file) return next();
  if (!imageCover || !images) return next();

  /**
   * ## JONAS
   * start from the cover image
   */
  /**
   * ## save to db
   */
  // eslint-disable-next-line require-atomic-updates, no-param-reassign
  // _req.body.imageCover = `tour-${
  //   _req.params.id || _req.body.id
  // }-${Date.now()}-cover.jpeg`;

  await autoResizeImage(imageCover[0].buffer, _req.body.imageCover, {
    width: 2000,
    height: 1333,
  });

  /**
   * ## save resized image cover to store in imagekit?
   */
  // eslint-disable-next-line require-atomic-updates, no-param-reassign
  // _req.resizedImages.resizedImageCover = resizedImage;

  /**
   * ## JONAS
   * loop over the images
   */
  // eslint-disable-next-line require-atomic-updates, no-param-reassign
  _req.body.images = [];
  await Promise.all(
    images.map(async (image: Express.Multer.File, index: number) => {
      if (!image)
        return next(
          new AppError(
            'Something went wrong while uploading an image',
            statusCodes.internalServerError
          )
        );
      const fileName = `tour-${_req.params.id || _req.body.id}-${Date.now()}-${
        index + 1
      }.jpeg`;
      await autoResizeImage(image.buffer, fileName, {
        width: 2000,
        height: 1333,
      });
      _req.body.images.push(fileName);
    })
  );

  // _req.files.forEach(async (file: any) => {
  //   await autoResizeImage(file.buffer, file.filename, {
  //     width: 2000,
  //     height: 1333,
  //   });
  // });

  // _req.files.entries().forEach((key: any, value: any[]) => {
  //   value.forEach(async (file: any) => {
  //     const fileName = `${key}-${Date.now()}.jpeg`;
  //     await autoResizeImage(file.buffer, fileName, {
  //       width: 2000,
  //       height: 1333,
  //     });
  //   });
  // });
  // await sharp(_req.file.buffer)
  //   .resize(2000, 1333)
  //   .toFormat('jpeg')
  //   .jpeg({ quality: 90 })
  //   .toFile(`public/img/tours/${_req.file.filename}`);

  next();
});

// ! specific middleware
const aliasTopTours = function aliasMiddleware(
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) {
  req.query = {
    limit: '5',
    sort: '-ratingsAverage, price',
    fields: 'name,price,ratingsAverage,summary,difficulty',
  };
  next();
};

// ! route handlers
// with single catchAsync
// const getAllTours = catchAsync(async function getAllTours(
//   _req: any,
//   _res: any
// ) {
//   // console.log(_req.body);

//   // it is Tour.find() that creates a query. Tour is only a model

//   const features = new APIFeaturesJonas(Tour.find(), _req.query);
//   features.filter().sort().limitFields().paginate();

//   // ! execute the query
//   // const tours = await APIfeats.mongooseQuery;
//   const tours = await features.mongooseQuery;

//   // ! send response
//   _res.status(200).send({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });
const getAllTours = getAll({
  Model: Tour,
});

const getTour = getOne({
  Model: Tour,
  idName: 'id',
  populateOptions: 'reviews',
});

// const getTour = catchAsync(async function getTour(
//   _req: any,
//   res: any,
//   _next: any
// ) {
//   const { id } = _req.params;
//   // const tour = await Tour.findById(id).populate('guides'); // populate will query the user collection and replace the id with the actual data
//   /**
//    * ## POPULATE with an object to selectively filter the fields
//    * # On refactor, we moved the populate to the model in the pre query middleware
//    *
//    * The populate reviews was added later
//    * in this case, select() doesn't support populated paths to remove repeated tour field, we must specify in the populate
//    */
//   // const tour = await Tour.findById(id).populate('reviews', '-tour'); // we have to tell mongoose to populate the virtual property
//   /*******************************
//   * JONAS TURNED OFF THE POPULATE on the review due to cirtular referencing. we can now show the tour and it will display ID only
//   /*******************************/

//   const tour = await Tour.findById(id).populate('reviews'); // we have to tell mongoose to populate the virtual property

//   // populate will query the user collection and replace the id with the actual data - moved to pre query middleware to prevent
//   // duplication of code
//   /*.populate({
//     path: 'guides',
//     select: '-__v -passwordChangedAt',
//   })*/ // we need to return to exit the function ( same is if else )
//   if (!tour) return _next(new AppError(`id ${id} doesnt't exist`, 404));

//   res.status(200).send({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// with single catchAsync entry
// const createTour = catchAsync(async function postNewTour(_req: any, res: any) {
//   const tour = await Tour.create(_req.body);
//   res.status(201).send({
//     status: 'success',
//     data: { tour },
//   });
// });
const createTour = createOne({
  Model: Tour,
});

// const patchTour = catchAsync(async function patchTour(
//   _req: any,
//   res: any,
//   _next: any
// ) {
//   const { id } = _req.params;
//   const { body } = _req;
//   const tour = await Tour.findByIdAndUpdate(id, body, {
//     new: true, // returns the new document
//     runValidators: true,
//   });
//   // we need to return to exit the function ( same is if else )
//   if (!tour) return _next(new AppError(`id ${id} doesnt't exist`, 404));

//   res.status(200).send({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });
const validateTourOwnershipOrAdmin = validateOwnership({
  Model: Tour,
  idName: 'id',
});
const patchTour = patchOne({
  Model: Tour,
  idName: 'id',
});

// const deleteTour = catchAsync(async function deleteTour(
//   _req: any,
//   res: any,
//   _next: any
// ) {
//   const { id } = _req.params;
//   const tour = await Tour.findByIdAndDelete(id);
//   // we need to return to exit the function ( same is if else )
//   if (!tour) return _next(new AppError(`id ${id} doesnt't exist`, 404));
//   res.status(204).send({
//     status: 'success',
//     // eslint-disable-next-line unicorn/no-null
//     data: null,
//   });
// });
const deleteTour = deleteOne({
  Model: Tour,
  idName: 'id',
});

/**
 * ## AGGREGATION PIPELINE
 */
const getTourStats = catchAsync(async function getTourStats(
  _req: any,
  res: any
) {
  // aggregation pipeline is a mongodb feature, mongoose has access to it, we can use it in the mongoose driver
  const stats = await Tour.aggregate([
    // steps ( stages ) - array of objects
    // match: select or filter a doc
    {
      // preliminary stage
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      // group stage: group docs together using an accumulator
      $group: {
        // eslint-disable-next-line unicorn/no-null
        // _id: null, // what to group by, null for everything, can group for a prop and calc the average for the difficult only
        _id: { $toUpper: '$difficulty' },
        // _id: '$ratingsAverage',
        numTours: { $sum: 1 }, // for each doc on the pipeline, add 1
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    // stage sort
    {
      // need field names from the group stage: other names don't exist
      $sort: { avgPrice: 1 }, // 1 is ascending
    },
    // {
    //     // can repeat stages
    //     // select all docs that are not easy, not equal
    //     $match: { _id: { $ne: 'EASY' } }, // id is the previous stage name
    // },
  ]);
  res.status(200).send({
    status: 'success',
    // eslint-disable-next-line unicorn/no-null
    data: stats,
  });
});

/**
 * handler function for route
 * show tours count per month on a given year
 *
 * @async
 * @param _req - request object
 * @param res - response object
 */
const getMonthlyPlan = catchAsync(async function getMonthlyPlan(
  _req: any,
  res: any
) {
  // what we have:
  // name
  // startDates: Date[]

  // my own thinking, wrong!
  // year to filter in the query string? ?year=2022 or using param /year
  // sort by year
  // sort by name
  // sort by start dates
  // in yeas 2022 you have
  // total of 40 tours
  // 10 of name1, 20 of name2, 10 of name3
  // in january, total of 5 ( 3 of name1, 2 of name2)

  // console.log(_req.params);

  // eslint-disable-next-line no-unsafe-optional-chaining
  const year = +_req.params?.year;
  // console.log(typeof year);

  const pipeline: any[] = [
    // deconstruct the array to have multiple objects ( 1 per date )
    {
      $unwind: '$startDates',
    },
    // select documents for the year we passed in
    {
      $match: {
        // greater equal than jan 1, smaller jan 1 next year ( greater than 2020 smaller than 2022)
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    // grouping by month
    {
      $group: {
        _id: { $month: '$startDates' }, // group by month
        numTourStarts: { $sum: 1 }, // count how many tours start that month
        // tours: { $push: '$name' }, // need to use an array ( multiple items per object ), use push method
        tours: {
          $push: {
            // if we push an object, we get an object
            name: '$name',
            quantity: { $sum: 1 }, //  count the quantity per tour // doesn't work will repeat tours
          },
        }, // need to use an array ( multiple items per object ), use push method
      },
    },
    {
      // substitue the _id for month
      $addFields: { month: '$_id' },
    },
    {
      // get rid of _id with project
      $project: {
        // we give fields 0 or 1, 0 is not show, 1 is show
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 }, // 1 ascending, -1 descending
    },
    {
      // limit similar to limit in query, limit to 6 outputs
      $limit: 12,
    },
  ];

  // if (!year) {
  //     pipeline = pipeline.filter(
  //         (element: any) => !('$match' in element)
  //     );
  // }

  const plan = await Tour.aggregate(pipeline);

  res.status(statusCodes.ok).send({
    status: 'success',
    // eslint-disable-next-line unicorn/no-null
    data: plan,
  });
});

/**
 * @description
 * route handler to set the query params to get all  tours within a certain distance from a certain point
 * @async
 */
//  ## possible ways
//  use query url with params /tours-within/:distance/center/:latlng/unit/:unit
//  {{URL}}api/v1/tours/tours-within/200/center/-40,45/unit/mi
//  or
//  user query string /tours-within?distance=233&center=-40,45&unit=mi
const getToursWithin = catchAsync(async function getToursWithin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // console.log(req.params);

  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  /**
   * ## validate lat lng
   */
  if (!(lat && lng))
    return next(
      new AppError(
        'Latitude and longitude must be specified in the format lat,lng',
        statusCodes.badRequest
      )
    );

  // distance we want to have as the radius converted as a special unit called radians
  // divide the distance by the radius of the earth
  // const earthRadius = unit === 'mi' ? 3963.2 * 1.609_344 : 3963.2;
  // const correctDistance = unit === 'mi' ? +distance : +distance * 1.609_344;
  // const radius = correctDistance / earthRadius; // 3963.2 is the radius of the earth in miles
  const radius = unit === 'mi' ? +distance / 3963.2 : +distance / 6378.1; // if unit not mi assume it's km, radians
  /**
   * ## geospatial query, similar to normal query
   * need to specify filter object
   */
  const tours = await Tour.find({
    // query for the start location using geospatial operator (geowithin)
    startLocation: {
      // finds documents withing a certain geometry
      // find them inside of a sphere that starts at the point we defined (center) for a radius of distance
      $geoWithin: {
        // define the center sphere
        // centersphere takes an array of coords and of the radius
        $centerSphere: [
          // array of coords
          // IMP: always first longituted in mongoose
          [+lng, +lat],
          // radius in a special unit = RADIANS
          radius,
        ], // distance in radians, earth radius in miles
      },
    },
  });
  // geo spatial mongooseQuery
  // start location is a geo spatial index
  //

  res.status(statusCodes.ok).send({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

const getDistances = catchAsync(async function getDistances(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!(lat && lng))
    return next(
      new AppError(
        'Latitude and longitude must be specified in the format lat,lng',
        statusCodes.badRequest
      )
    );
  const multiplier = unit === 'mi' ? 0.000_621_371 : 0.001;

  /**
   * ## to do calculations we use the aggregation pipeline
   * requires an array with all the stages of the pipeline
   * for geospatial aggregation there is a special stage called geoNear, single stage
   * only one that exists
   */
  const distances = await Tour.aggregate([
    {
      // geoNear always needs to be the first stage
      $geoNear: {
        // near is the point from which to calculate the distances
        // requires that at least one of the fields in the model has a geospatial index
        // in this case startLocation has a geospatial index we set
        // if there is only one field with a geospatial index, it will automatically use that field, otherwise we need to specify the keys
        /**
         * ## near is the point from which to calculate the distances
         * all distances will be calculated from this point and all the startLocations
         * mandatory field
         */
        near: {
          type: 'Point', // specify the type as geoJson
          coordinates: [+lng, +lat], // array of coordinates, first is longitute
        },
        /**
         * ## second mandatory field is distanceField
         */
        distanceField: 'distance', // name of the field where the calculated distances will be created and stored
        /**
         * ## convert the distance into kilometers
         */
        distanceMultiplier: multiplier, // convert the distance into kilometers
      },
    },
    /**
     * ## we could add other stages here
     */
    /**
     * ## PROJECT STAGE
     * convert meters into kilometers
     * show only distance and name of tour
     */
    {
      $project: {
        distance: 1,
        name: 1,
        ratingsAverage: 1,
        startLocation: 1,
      },
    },
  ]);

  // const pipelineItem = distancesAggregationPipeline.pipeline().shift() as any;
  // void distancesAggregationPipeline.append(pipelineItem);
  // const firstPipelineItem = distancesAggregationPipeline.pipeline().shift();
  // const [other, geonear] = distancesAggregationPipeline.pipeline();
  // const distances = await distancesAggregationPipeline;

  res.status(statusCodes.ok).send({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

export {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getDistances,
  getMonthlyPlan,
  getTour,
  getTourStats,
  getToursWithin,
  patchTour,
  resizeTourImages,
  uploadTourPhotosImagekit as uploadToImgKit,
  uploadTourImages,
  validateTourOwnershipOrAdmin,
};
