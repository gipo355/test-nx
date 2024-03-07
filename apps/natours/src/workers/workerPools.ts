// import bcrypt from 'bcrypt';
import {
  pool as createPool,
  type WorkerPool,
  type WorkerPoolOptions,
} from 'workerpool';

import {
  POOL_MAX_WORKERS,
  POOL_MIN_WORKERS,
  // SALT_WORK_FACTOR,
} from '../config';
import { Logger } from '../loggers';

const poolOptions: WorkerPoolOptions = {
  // ...(minWorkers && { minWorkers }),
  // ...(maxWorkers && { maxWorkers }),
  // ...(workersThreads.minWorkers && { minWorkers: POOL_MIN_WORKERS }),
  // ...(workersThreads.maxWorkers && { maxWorkers: POOL_MAX_WORKERS }),
  ...(POOL_MIN_WORKERS && { minWorkers: POOL_MIN_WORKERS }),
  ...(POOL_MAX_WORKERS && { maxWorkers: POOL_MAX_WORKERS }),
  // minWorkers,
  // maxWorkers
};

// TODO: require worker types ( check fastify ) for proxies

let poolProxy: WorkerPool['proxy'];
let pool: WorkerPool;
let emailPoolProxy: WorkerPool['proxy'];
let imagePoolProxy: WorkerPool['proxy'];

export  workerInit = async () => {
  pool = createPool(`${__dirname}/worker1.js`, poolOptions);

  poolProxy = await pool.proxy();

  Logger.info(
    `Worker pool enabled - minThreads: ${
      poolOptions.minWorkers
    } -  maxThreads: ${poolOptions.maxWorkers} - totalWorkers: ${
      pool.stats().totalWorkers
    }`
  );
};

export const bullmqPoolInit = async () => {
  emailPoolProxy = await createPool(
    `${__dirname}/bullmqWorkerInPool.js`,
    poolOptions
  ).proxy();

  Logger.info(
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
export const imagePoolInit = async () => {
  imagePoolProxy = await createPool(
    `${__dirname}/imageWorker.js`,
    poolOptions
  ).proxy();

  Logger.info(
    `image Pool enabled - minThreads: ${
      poolOptions.minWorkers
    } -  maxThreads: ${poolOptions.maxWorkers} - totalWorkers: ${
      pool.stats().totalWorkers
    }`
  );
};

export {
  emailPoolProxy,
  imagePoolProxy,
  pool as pool1,
  poolProxy,
};
