import { fileURLToPath } from 'node:url';

import type { FastifyInstance } from 'fastify';
import {
  pool as createPool,
  type Proxy,
  type WorkerPool,
  type WorkerPoolOptions,
} from 'workerpool';

// import { POOL_MAX_WORKERS, POOL_MIN_WORKERS } from '../config.js';
// import { logger } from '../fastify.js';
import type { Jobs } from './jobs.js';

// eslint-disable-next-line import/no-mutable-exports
let pool1: WorkerPool;
// eslint-disable-next-line import/no-mutable-exports
let pool1Proxy: Proxy<Jobs>;

// TODO: CAREFULL, PROXIES INITIALIZE LATE
// if something needs a worker early, i need to find a solution to await the inizialization of poolproxy
const pool1Init = async (instance: FastifyInstance) => {
  const poolOptions: WorkerPoolOptions = {
    ...(instance.config.POOL_MIN_WORKERS !== undefined && {
      minWorkers: instance.config.POOL_MIN_WORKERS,
    }),
    ...(instance.config.POOL_MAX_WORKERS !== undefined && {
      maxWorkers: instance.config.POOL_MAX_WORKERS,
    }),
  };

  pool1 = createPool(
    // `${__dirname}/worker1/worker1.js`,
    fileURLToPath(new URL('jobs.js', import.meta.url)),
    poolOptions
  );

  pool1Proxy = await pool1.proxy();

  instance.log.info(
    `👷 Worker pool 1 initialized [minThreads: ${
      poolOptions.minWorkers
    },  maxThreads: ${poolOptions.maxWorkers}, totalWorkers: ${
      pool1.stats().totalWorkers
    }]`
  );
};

export { pool1, pool1Init, pool1Proxy };
