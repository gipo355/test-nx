// import { DEFAULT_LIMIT_PER_PAGE, DEFAULT_PAGE } from '../../../config';
// import { APIFeatures } from './APIFeatures';

import express from 'express';

import { APIFeaturesJonas, catchAsync } from '../../../helpers';
import { Logger } from '../../../loggers';
import { Tour } from '../../../models';

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
//     _req: any,
//     _res: any,
//     _next: any
// ) {
//     // it is Tour.find() that creates a query. Tour is only a model

//     const features = new APIFeaturesJonas(Tour.find(), _req.query);
//     await features.filter().sort().limitFields().paginate();

//     // ! execute the query
//     // const tours = await APIfeats.mongooseQuery;
//     const tours = await features.mongooseQuery;

//     // ! send response
//     _res.status(200).send({
//         status: 'success',
//         results: tours.length,
//         data: {
//             tours,
//         },
//     });
// });

const getAllTours = async function getAllTours(_req: any, _res: any) {
  try {
    // it is Tour.find() that creates a query. Tour is only a model

    const features = new APIFeaturesJonas(Tour.find(), _req.query);
    await features.filter().sort().limitFields().paginate();

    // ! execute the query
    // const tours = await APIfeats.mongooseQuery;
    const tours = await features.mongooseQuery;

    // ! send response
    _res.status(200).send({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error: any) {
    _res.status(404).send({
      status: 'fail',
      message: error.message,
    });
    Logger.info(error);
    // throw error;
  }
};

const getTour = async function getTour(_req: any, res: any) {
  try {
    const { id } = _req.params;
    const tour = await Tour.findById(id);
    res.status(200).send({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    Logger.http(error);
    res.status(404).send({
      status: 'fail',
      message: error,
    });
  }
};

// with single catchAsync entry
const createTour = catchAsync(async function postNewTour(_req: any, res: any) {
  const tour = await Tour.create(_req.body);
  res.status(201).send({
    status: 'success',
    data: { tour },
  });
});

// const createTour = async function postNewTour(_req: any, res: any) {
//     try {
//         const tour = await Tour.create(_req.body);
//         res.status(201).send({
//             status: 'success',
//             data: { tour },
//         });
//     } catch (error: any) {
//         Logger.info(`Create Tour error: ${error}`);
//         res.status(400).send({
//             status: 'fail',
//             message: error, // don't do this in production
//         });
//     }
// };

const patchTour = async function patchTour(_req: any, res: any) {
  try {
    const { id } = _req.params;
    const { body } = _req;
    const tour = await Tour.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).send({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: 'fail',
      message: error,
    });
    Logger.info(error);
  }
};

const deleteTour = async function deleteTour(_req: any, res: any) {
  try {
    const { id } = _req.params;
    await Tour.findByIdAndDelete(id);
    res.status(204).send({
      status: 'success',
      // eslint-disable-next-line unicorn/no-null
      data: null,
    });
  } catch (error) {
    Logger.info(error);
    res.status(400).send({
      status: 'fail',
      message: error,
    });
  }
};

/**
 * ## AGGREGATION PIPELINE
 */
const getTourStats = async function getTourStats(_req: any, res: any) {
  try {
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
  } catch (error) {
    Logger.info(error);
    res.status(400).send({
      status: 'fail',
      message: error,
    });
  }
};

/**
 * handler function for route
 * show tours count per month on a given year
 *
 * @async
 * @param _req - request object
 * @param res - response object
 */
const getMonthlyPlan = async function getMonthlyPlan(_req: any, res: any) {
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

  try {
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

    res.status(200).send({
      status: 'success',
      // eslint-disable-next-line unicorn/no-null
      data: plan,
    });
  } catch (error: any) {
    Logger.info(error);
    res.status(400).send({
      status: 'fail',
      message: error.message,
    });
  }
};

export {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getMonthlyPlan,
  getTour,
  getTourStats,
  patchTour,
};
