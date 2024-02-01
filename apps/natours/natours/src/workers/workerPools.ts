// import bcrypt from 'bcrypt';
import { pool as createPool, type WorkerPoolOptions } from 'workerpool';

import {
  POOL_MAX_WORKERS,
  POOL_MIN_WORKERS,
  // SALT_WORK_FACTOR,
} from '../config';
import { Logger } from '../loggers';
// eslint-disable-next-line import/extensions
// import worker1 from './worker1.worker.js';
// import { SALT_WORK_FACTOR } from '../config';
// import { Logger } from '../loggers';

/**
 * ## !!!! POOL CAN BE CREATED ANYWHERE
 * DOESN'T NEED A WORKER FILE, IN THE EXEC WE CAN SPECIFY THE FUNCTION DIRECTLY
 * BCRYPT DOESN'T WORK INSIDE THE FUNCTION TO BE CALLED FROM THE POOL
 * at the moment, with webpack, can't export. bind problem
 */

// ! worker pool
// const workersThreads: WorkerPoolOptions = {
//     minWorkers: POOL_MIN_WORKERS,
//     maxWorkers: +POOL_MAX_WORKERS,
// };

const poolOptions: WorkerPoolOptions = {
  // ...(minWorkers && { minWorkers }),
  // ...(maxWorkers && { maxWorkers }),
  // ...(workersThreads.minWorkers && { minWorkers: POOL_MIN_WORKERS }),
  // ...(workersThreads.maxWorkers && { maxWorkers: POOL_MAX_WORKERS }),
  ...((POOL_MIN_WORKERS as any) && { minWorkers: POOL_MIN_WORKERS }),
  ...((POOL_MAX_WORKERS as any) && { maxWorkers: POOL_MAX_WORKERS }),
  // minWorkers,
  // maxWorkers
};

// const workerPool1 = createPool(poolOptions);
// const poolProxy = await workerPool1.proxy();
// const getWorker = () => poolProxy;

// export const encryptPasswordPool = async function encryptPassword(
//     password: string
// ) {
//     const result = {
//         password,
//         // eslint-disable-next-line unicorn/no-null
//         error: null,
//     };

//     // result.password = await bcrypt.hash(password, SALT_WORK_FACTOR);
//     result.password = await workerPool1.exec(bcrypt.hash, [
//         password,
//         SALT_WORK_FACTOR,
//     ]);
//     return result;
// };

// export const comparePasswordPool = async function checkUser(
//     hash: string,
//     password: string
// ) {
//     //... fetch user from a db etc.

//     const isMatch = await bcrypt.compare(password, hash);

//     return isMatch;
// };

// webpack way for importing the file into './assets' and referring to its path
// const worker1URL = new URL('worker1.js', import.meta.url);

// Logger.info(
//     `Worker Pool 1 active with workers: (min:${poolOptions.minWorkers}), (max:${poolOptions.maxWorkers})`
// );

// const workerPool1 = createPool(worker1URL.pathname.toString(), poolOptions);
// const workerPool1 = createPool();

// worker({
//     encryptPassword,
//     comparePassword,
// });

// ! trying guide on dev.to https://dev.to/johnjardincodes/managing-multiple-threads-in-node-js-3mpc
// ! WORKED

// eslint-disable-next-line import/no-mutable-exports
let poolProxy: any;
// eslint-disable-next-line import/no-mutable-exports
let pool: any;

// eslint-disable-next-line import/no-mutable-exports
let emailPoolProxy: any;

// eslint-disable-next-line import/no-mutable-exports
let imagePoolProxy: any;

// TODO: CAREFULL, PROXIES INITIALIZE LATE
// if something needs a worker early, i need to find a solution to await the inizialization of poolproxy
const workerInit = async () => {
  // ! differnt ways to import the worker ( changing webpack test rules, asset, new URL, copyplugin)
  // const worker1URL = new URL('worker1.js', import.meta.url);
  // pool = createPool(worker1URL.pathname.toString(), poolOptions);
  // pool = createPool('./workers/worker1.js', poolOptions); // used copy Plugin

  // ! best way found, compatible with tests, typescript and webpack (copyplugin same folder)
  // eslint-disable-next-line unicorn/prefer-module
  pool = createPool(`${__dirname}/worker1.js`, poolOptions); // used copy Plugin

  // pool = createPool(`./${worker1}`, poolOptions); // used copy Plugin
  // console.log(worker1);

  // const pool = createPool(poolOptions);
  poolProxy = await pool.proxy();
  Logger.info(
    // `worker threads enabled - Min workers: ${pool.minWorkers} - Max Workers: ${pool.maxWorkers} - Worker Type: ${pool.workerType}`
    // `worker threads enabled with  - stats: ${pool.stats} - options: ${poolOptions}`
    `Worker pool enabled - minThreads: ${
      poolOptions.minWorkers
    } -  maxThreads: ${poolOptions.maxWorkers} - totalWorkers: ${
      pool.stats().totalWorkers
    }`
  );

  // this is gonna be the bullmq email worker, in a thread pool. we don't need to call the function ( entry point in webpack )

  /**
   * ## CAREFULL, WE NEED TO BE SURE POOLPROXY HAS DONE THE ASYNC INITIALIZATION BEFORE USING POOLPROXY ( it's better to wrap everything )
   * think if you need to use poolproxy early or it will be undefined
   */
};

const bullmqPoolInit = async () => {
  emailPoolProxy = await createPool(
    `${__dirname}/bullmqWorkerInPool.js`, // we added an entry point to webpack to allow writing external ts files to be transpiled to js ( we still need to call the js file )
    poolOptions
  ).proxy();

  Logger.info(
    // `worker threads enabled - Min workers: ${pool.minWorkers} - Max Workers: ${pool.maxWorkers} - Worker Type: ${pool.workerType}`
    // `worker threads enabled with  - stats: ${pool.stats} - options: ${poolOptions}`
    `bullMq pool enabled - minThreads: ${
      poolOptions.minWorkers
    } -  maxThreads: ${poolOptions.maxWorkers} - totalWorkers: ${
      pool.stats().totalWorkers
    }`
  );
};

/**
 * ## add image pool for image manipulation
 */
const imagePoolInit = async () => {
  imagePoolProxy = await createPool(
    `${__dirname}/imageWorker.js`, // we added an entry point to webpack to allow writing external ts files to be transpiled to js ( we still need to call the js file )
    poolOptions
  ).proxy();

  Logger.info(
    // `worker threads enabled - Min workers: ${pool.minWorkers} - Max Workers: ${pool.maxWorkers} - Worker Type: ${pool.workerType}`
    // `worker threads enabled with  - stats: ${pool.stats} - options: ${poolOptions}`
    `image Pool enabled - minThreads: ${
      poolOptions.minWorkers
    } -  maxThreads: ${poolOptions.maxWorkers} - totalWorkers: ${
      pool.stats().totalWorkers
    }`
  );
};

// export { poolProxy as workerPool1 }; // ! doesnt work
export {
  bullmqPoolInit,
  emailPoolProxy,
  imagePoolInit,
  imagePoolProxy,
  pool as pool1,
  poolProxy,
  workerInit,
};
// export { poolProxy };
