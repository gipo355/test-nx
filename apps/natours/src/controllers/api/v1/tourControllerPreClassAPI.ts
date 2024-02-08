import { DEFAULT_LIMIT_PER_PAGE, DEFAULT_PAGE } from '../../../config';
import { Logger } from '../../../loggers';
import { Tour } from '../../../models';

// ! route handlers

const getAllTours = async function getAllTours(_req: any, _res: any) {
  try {
    // console.log(_req.query);

    // sanitize request
    //
    // ! BUILD QUERY
    // create shallow copy of query object to prevent mutations, reference to original object
    const queryOBJ = { ..._req.query };

    // ! filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // eslint-disable-next-line no-restricted-syntax
    for (const element of excludedFields) delete queryOBJ[element];

    // ! advanced filtering
    // stringify the query obj then replace the fields you want
    // const allowedQueryMethods = ['gte', 'lte', 'lt', 'gt', 'e'];
    const stringQuery = JSON.stringify(queryOBJ);

    // ! my solution
    // eslint-disable-next-line unicorn/no-array-for-each
    // allowedQueryMethods.forEach((method) => {
    //     const regEx = new RegExp(`\\b${method}\\b`, 'gi');
    //     stringQuery = stringQuery.replaceAll(regEx, `$${method}`);
    // });
    // const queryObjectParsed = JSON.parse(stringQuery);

    // ! jonas solution
    // the replace function has a callback which provides the match word, the return is the replaced value
    const parsedQueryObject = JSON.parse(
      stringQuery.replace(
        /\b(gt|gte|lt|lte|e)\b/g,
        (replacedWord) => `$${replacedWord}`
      )
    );
    // example mongodb filter object { difficulty: 'easy', duration: { $gte: 5 } }

    // filter
    // eslint-disable-next-line unicorn/no-array-callback-reference
    let toursQuery = Tour.find(parsedQueryObject); // filter as above, don't await because we need to sort

    /**
     * ! ##  sorting
     */

    // check if sort is present
    if (_req.query.sort) {
      // sort ( uses name or -name for sorting. specified in the url)
      // allowed mongoose sort syntax: Query.sort('price -ratingsAverage');
      const sortArguments = _req.query.sort.split(',').join(' ');
      toursQuery = toursQuery.sort(sortArguments);
      // in case of a tie, in mongoose we just need to specify another field ( ratingAvg or name )
    } else {
      // default sort if not present
      toursQuery = toursQuery.sort('-createdAt');
    }

    /**
     * ! ## field limiting
     */

    if (_req.query.fields) {
      // similar to sort, mongoose accepts select('field1 field2')
      const fieldsArguments = _req.query.fields.split(',').join(' ');
      // eslint-disable-next-line no-void
      void toursQuery.select(fieldsArguments);
      // block not to be shown props
      // eslint-disable-next-line no-void
      void toursQuery.select('-__v');
    } else {
      // eslint-disable-next-line no-void
      void toursQuery.select('-__v');
    }

    /**
     * ! ## pagination
     * example query: query = query.skip(10).limit(10)
     * limit = amout of results we want in the query
     * page=2&limit=10
     * page 1-10 are page 1, 11-20 page 2 etc...
     * we want to skip 10 results before we start querying
     * skip = amount of results to be skipped before querying data
     * the skip value is abstract for the user, we want to calc it for them
     */

    const limitPerPage = +_req.query.limit || DEFAULT_LIMIT_PER_PAGE; // manual conversion
    const page = +_req.query.page || DEFAULT_PAGE;

    const skip = (page - 1) * limitPerPage;
    // console.log(page, limitPerPage, skip);
    // if (_req.query.page) {
    //     const resultsSkipped = _req.query.page * limitPerPage; // type cohersion here ( no need to convert to number)
    //     // eslint-disable-next-line no-void
    //     void toursQuery.skip(resultsSkipped);
    // }
    // eslint-disable-next-line no-void
    void toursQuery.skip(skip).limit(limitPerPage);
    // eslint-disable-next-line no-void
    // void toursQuery.skip(6).limit(3);

    /**
     * ## throw err if no results in page
     */
    if (_req.query.page) {
      const numberTours = await Tour.countDocuments();
      // console.log(numberTours);

      if (skip >= numberTours)
        throw new Error(
          `not enough results: max pages with limit=${limitPerPage} is ${Math.floor(
            numberTours / limitPerPage
          )}`
        );
    }

    // ! execute the query
    const tours = await toursQuery;

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

const createTour = async function postNewTour(_req: any, res: any) {
  try {
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

export { createTour, deleteTour, getAllTours, getTour, patchTour };
