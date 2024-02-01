/* eslint-disable unicorn/filename-case */

import { DEFAULT_LIMIT_PER_PAGE, DEFAULT_PAGE } from '../config';

class APIFeatures {
  mongooseQuery: any;

  queryStringObj: Record<string, any>;

  originalQuery: any;

  constructor(query: any, queryString: Record<string, any>) {
    // careful, doesn't this mutate the original reference objects?
    this.mongooseQuery = query;
    this.queryStringObj = queryString;
    this.originalQuery = query;
  }

  find() {
    const queryOBJ = { ...this.queryStringObj };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // eslint-disable-next-line no-restricted-syntax, security/detect-object-injection
    for (const element of excludedFields) delete queryOBJ[element];

    // ! advanced filtering
    const stringQuery = JSON.stringify(queryOBJ);

    // ! jonas solution
    // the replace function has a callback which provides the match word, the return is the replaced value
    const parsedQueryObject = JSON.parse(
      stringQuery.replace(
        /\b(gt|gte|lt|lte|e)\b/g,
        (replacedWord) => `$${replacedWord}`
      )
    );
    // eslint-disable-next-line unicorn/no-array-callback-reference
    this.mongooseQuery = this.mongooseQuery.find(parsedQueryObject); // filter as above, don't await because we need to sort
    return this;
  }

  /**
   * ! ##  sorting
   */
  sort() {
    // check if sort is present
    if (this.queryStringObj.sort) {
      const queryOBJ = { ...this.queryStringObj };
      // sort ( uses name or -name for sorting. specified in the url)
      // allowed mongoose sort syntax: Query.sort('price -ratingsAverage');
      const sortArguments = queryOBJ.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortArguments);
      // in case of a tie, in mongoose we just need to specify another field ( ratingAvg or name )
    } else {
      // default sort if not present
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  /**
   * ! ## field limiting
   */

  fields() {
    const queryOBJ = { ...this.queryStringObj };
    if (queryOBJ.fields) {
      // similar to sort, mongoose accepts select('field1 field2')
      const fieldsArguments = this.queryStringObj.fields.split(',').join(' ');
      // eslint-disable-next-line no-void
      void this.mongooseQuery.select(fieldsArguments);
      // block not to be shown props
      // eslint-disable-next-line no-void
      void this.mongooseQuery.select('-__v');
    } else {
      // eslint-disable-next-line no-void
      void this.mongooseQuery.select('-__v');
    }

    return this;
  }

  // we pass the query param because we need the origina object
  async pagination() {
    const queryOBJ = { ...this.queryStringObj };
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

    const limitPerPage = +queryOBJ.limit || DEFAULT_LIMIT_PER_PAGE; // manual conversion
    const page = +queryOBJ.page || DEFAULT_PAGE;

    const skip = (page - 1) * limitPerPage;
    // console.log(page, limitPerPage, skip);
    // if (queryOBJ.page) {
    //     const resultsSkipped = queryOBJ.page * limitPerPage; // type cohersion here ( no need to convert to number)
    //     // eslint-disable-next-line no-void
    //     void toursQuery.skip(resultsSkipped);
    // }
    // eslint-disable-next-line no-void
    void this.mongooseQuery.skip(skip).limit(limitPerPage);
    // eslint-disable-next-line no-void
    // void toursQuery.skip(6).limit(3);

    /**
     * ## throw err if no results in page
     */
    if (queryOBJ.page) {
      const numberTours = await this.originalQuery.countDocuments();
      // console.log(numberTours, 'number tours');

      if (skip >= numberTours)
        throw new Error(
          `not enough results: max pages with limit=${limitPerPage} is ${Math.ceil(
            numberTours / limitPerPage
          )}`
        );
    }
    return this;
  }
}
export { APIFeatures };
