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

let workerPool: WorkerPool;
let workerPoolProxy: WorkerPool['proxy'];
let emailPoolProxy: WorkerPool['proxy'];
let imagePoolProxy: WorkerPool['proxy'];

export const workerPoolInit = async () => {
  workerPool = createPool(`${__dirname}/worker1.js`, poolOptions);

  workerPoolProxy = await workerPool.proxy();

  Logger.info(
    `Worker pool enabled - minThreads: ${
      poolOptions.minWorkers
    } -  maxThreads: ${poolOptions.maxWorkers} - totalWorkers: ${
      workerPool.stats().totalWorkers
    }`
  );
};

export const bullmqPoolInit = async () => {
  const bullPool = createPool(
    `${__dirname}/bullmqWorkerInPool.js`,
    poolOptions
  );

  emailPoolProxy = await bullPool.proxy();

  Logger.info(
    `bullMq pool enabled - minThreads: ${
      poolOptions.minWorkers
    } -  maxThreads: ${poolOptions.maxWorkers} - totalWorkers: ${
      bullPool.stats().totalWorkers
    }`
  );
};

/**
 * ## add image pool for image manipulation
 */
export const imagePoolInit = async () => {
  const imagePool = createPool(`${__dirname}/imageWorker.js`, poolOptions);

  imagePoolProxy = await imagePool.proxy();

  Logger.info(
    `image Pool enabled - minThreads: ${
      poolOptions.minWorkers
    } -  maxThreads: ${poolOptions.maxWorkers} - totalWorkers: ${
      workerPool.stats().totalWorkers
    }`
  );
};

export { emailPoolProxy, imagePoolProxy, workerPool, workerPoolProxy };
