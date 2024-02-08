import { readFileSync, writeFile } from 'node:fs';

import json from '../../../../assets/dev-data/data/tours-simple.json';
import { Logger } from '../../../loggers';
// we are using synch to load on start

const parsedToursData = JSON.parse(readFileSync(json).toString('utf8'));

// ! check id with param middleware
const checkTourId = function checkID(
  _req: any,
  _res: any,
  _next: any,
  _value: any
) {
  //
  const id = _value;
  const tour = parsedToursData.find((element: any) => +id === element.id);
  if (tour) {
    _next();
  } else {
    Logger.debug(
      `requested invalid resource @: ${_req.baseUrl} - resource: ${_value}`
    );
    return _res.status(404).send({
      status: 'fail',
      message: 'invalid id',
    });
  }
};

const getAllTours = function getAllTours(_req: any, _res: any) {
  _res.status(200).send({
    status: 'success',
    // results is not part of the json specification but useful for consumers, only with arrays
    // only when sending arr with multiple objects
    results: parsedToursData.length,
    data: {
      // we use tours because it's the name of the endpoint
      tours: parsedToursData,
    },
  });
};

const getTour = function getTour(request: any, response: any) {
  // console.log(request.params);
  const { id } = request.params;
  const tour = parsedToursData.find((element: any) => +id === element.id);

  if (tour) {
    response.status(200).send({
      status: 'success',
      data: {
        tour,
      },
      // results is not part of the json specification but useful for consumers, only with arrays
      // only when sending arr with multiple objects
      // results: parsedToursData.length,
      // data: {
      //     // we use tours because it's the name of the endpoint
      //     tours: parsedToursData,
      // },
    });
  } else {
    response.status(404).send({
      status: 'fail',
      message: 'invalid id',
    });
  }
};

const blockIDInsertionMiddleware = function block(
  req: any,
  res: any,
  next: any
) {
  const keys = Object.keys(req.body);
  if (keys.includes('id') || keys.includes('_id'))
    return res.status(400).json({
      status: 'fail',
      message: "can't insert ID",
    });
  next();
};

const checkRequiredKeys = function block(
  this: string[],
  req: any,
  res: any,
  next: any
) {
  const keys = Object.keys(req.body);
  const areAllRequired = this.every((reqK) => keys.includes(reqK));
  if (!areAllRequired)
    return res.status(400).json({
      status: 'fail',
      message: `keys [${[...this]}] must be provided`,
    });
  next();
};

const blockIfBodyIsEmpty = function block(req: any, res: any, next: any) {
  const keys = Object.keys(req.body);
  if (keys.length === 0)
    return res.status(400).json({
      status: 'fail',
      message: 'no data inserted',
    });
  next();
};

const validateAllKeys = function validateBody(req: any, res: any, next: any) {
  // should probably check for the required fields
  const correctKeysArray = Object.keys(parsedToursData[0]);
  const keys = Object.keys(req.body);

  const areAllKeysValid = keys.every((key) => {
    return correctKeysArray.includes(key);
  });

  if (!areAllKeysValid) {
    return res.status(400).json({
      status: 'fail',
      message: 'wrong data inserted',
    });
  }

  next();
};

const postNewTour = function postNewTour(request: any, response: any) {
  //
  // console.log(request.body);
  // ! specify the ID, always server side ( in this case no UUID needed since no database, take id of last object and add 1)
  // eslint-disable-next-line no-underscore-dangle
  const newId = parsedToursData.at(-1).id + 1;
  const newTour = { id: newId, ...request.body };
  // const newTours = parsedToursData.map((tour: any) => tour);
  // newTours.push(newTour);
  parsedToursData.push(newTour);

  // must be async, we are in the event loop
  // must stringify, it's a js object
  writeFile(json, JSON.stringify(parsedToursData), (err) => {
    if (err) throw err;

    // 201 status = created
    response.status(201).send({
      status: 'success',
      data: {
        tour: newTour,
      },
    }); // we always need to send something to finish the req res cycle
  });
};

const patchTour = function patchTour(request: any, response: any) {
  // get id
  const { id } = request.params;
  const newTour = request.body;
  // Logger.info(newTour);
  // Logger.info(id);

  // find tour with id
  const tour = parsedToursData.find((element: any) => element.id === +id); // not mutating
  // change tour props
  // const validKeys = Object.keys(tour);
  // console.log(validKeys);
  // const areAllKeysValid = Object.keys(newTour).every((key) =>
  //     validKeys.includes(key)
  // );
  // console.log('are all keys', areAllKeysValid);
  // const wrongKeys2 = Object.keys(newTour).filter(
  //     (key) => !validKeys.includes(key)
  // );
  // console.log(wrongKeys2);

  const wrongKeys: any[] = [];
  Object.entries(newTour)
    // eslint-disable-next-line unicorn/no-array-for-each
    .forEach(([key]) => {
      if (!tour[key]) {
        wrongKeys.push(key);
      }
    });
  if (wrongKeys.length > 0) {
    response.send({
      status: 'fail',
      message: `keys ${[...wrongKeys]} don't exist`,
    });
  } else {
    Object.entries(newTour)
      // eslint-disable-next-line unicorn/no-array-for-each
      .forEach(([key, value]) => {
        tour[key] &&= value;
      });
    // write tour
    // send tour ( not written here, only in memory)
    response.status(200).send({
      status: 'success',
      data: {
        tour,
      },
    });
    response.end();
  }
};
const deleteTour = function deleteTour(_request: any, response: any) {
  // console.log(request.params);
  // const { id } = request.params;
  // const tour = parsedToursData.find((element: any) => +id === element.id);

  // ! we are not writing and deleting atm

  // status 204 means no content
  response.status(204).send({
    status: 'success',
    // eslint-disable-next-line unicorn/no-null
    data: null,
  });
};
// export {
//     blockIDInsertionMiddleware,
//     blockIfBodyIsEmpty,
//     checkRequiredKeys,
//     checkTourId,
//     deleteTour,
//     getAllTours,
//     getTour,
//     patchTour,
//     postNewTour,
//     validateAllKeys,
// };
