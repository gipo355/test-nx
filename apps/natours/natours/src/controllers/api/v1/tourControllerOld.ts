import { Logger } from '../../../loggers';
import { Tour } from '../../../models';

// const blockIDInsertionMiddleware = function block(
//     req: any,
//     res: any,
//     next: any
// ) {
//     const keys = Object.keys(req.body);
//     if (keys.includes('id') || keys.includes('_id'))
//         return res.status(400).json({
//             status: 'fail',
//             message: "can't insert ID",
//         });
//     next();
// };

// const checkRequiredKeys = function block(
//     this: string[],
//     req: any,
//     res: any,
//     next: any
// ) {
//     const keys = Object.keys(req.body);
//     const areAllRequired = this.every((reqK) => keys.includes(reqK));
//     if (!areAllRequired)
//         return res.status(400).json({
//             status: 'fail',
//             message: `keys [${[...this]}] must be provided`,
//         });
//     next();
// };

// const blockIfBodyIsEmpty = function block(req: any, res: any, next: any) {
//     const keys = Object.keys(req.body);
//     if (keys.length === 0)
//         return res.status(400).json({
//             status: 'fail',
//             message: 'no data inserted',
//         });
//     next();
// };

// const validateAllKeys = function validateBody(req: any, res: any, next: any) {
//     // should probably check for the required fields
//     const correctKeysArray = new Set(['1']);
//     const keys = Object.keys(req.body);

//     const areAllKeysValid = keys.every((key) => {
//         return correctKeysArray.has(key);
//     });

//     if (!areAllKeysValid) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'wrong data inserted',
//         });
//     }

//     next();
// };

// ! route handlers

const getAllTours = async function getAllTours(_req: any, _res: any) {
  // console.log(_req.query);

  try {
    // Logger.info(_req.query);
    // console.table(_req.query);

    // 2 methods to filter with query string
    // 1: built in
    // we will use this because we have a similar object
    // const tours = await Tour.find({
    //      duration: 5,
    //      difficulty: 'easy'
    // })
    // 2: mongoose chaining

    // const tours = await Tour.find()
    //     .where('duration')
    //     .gte(5)
    //     .where('difficulty')
    //     .equals('easy');
    //     const tours = await Tour.find();

    // ! create shallow copy of query object to prevent mutations, reference to original object
    const queryOBJ = { ..._req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // remove these fields from the query obj
    // eslint-disable-next-line no-restricted-syntax
    for (const element of excludedFields) delete queryOBJ[element];
    const tours = await Tour.find(queryOBJ);

    _res.status(200).send({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    Logger.info(error);
    _res.status(404).send({
      status: 'fail',
      message: error,
    });
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

const createTour = async function postNewTour(_req: any, res: any) {
  try {
    // const newTour = new Tour({});
    // newTour.save();
    const tour = await Tour.create(_req.body);
    res.status(201).send({
      status: 'success',
      data: { tour },
    });
  } catch (error: any) {
    Logger.info(`Create Tour error: ${error}`);
    res.status(400).send({
      status: 'fail',
      message: error, // don't do this in production
    });
  }
};

const patchTour = async function patchTour(_req: any, res: any) {
  try {
    const { id } = _req.params;
    // const filter = { _id: id };
    // const { params } = _req;
    const { body } = _req;
    // filter, object to update, options
    // const tour = await Tour.findOneAndUpdate(filter, body, {
    //     // the new updated document will be returned to send it back
    //     new: true,
    //     runValidators: true,
    // });
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
    // const filter = { _id: id };
    await Tour.findByIdAndDelete(id);
    // await Tour.findByIdAndRemove(id);
    // await Tour.findOneAndDelete(filter);
    // await Tour.findOneAndRemove(filter);
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

export {
  // blockIDInsertionMiddleware,
  // blockIfBodyIsEmpty,
  // checkRequiredKeys,
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  patchTour,
  // validateAllKeys,
};
