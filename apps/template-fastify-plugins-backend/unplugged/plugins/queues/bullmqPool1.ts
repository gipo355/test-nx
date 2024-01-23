import { fileURLToPath } from 'node:url';

import type { FastifyInstance } from 'fastify';
import {
  pool as createPool,
  type Proxy,
  type WorkerPool,
  type WorkerPoolOptions,
} from 'workerpool';

import type { BullmqJobs } from './jobs.js';

// eslint-disable-next-line import/no-mutable-exports
let bullmqPool1: WorkerPool;
// eslint-disable-next-line import/no-mutable-exports
let bullmqPool1Proxy: Proxy<BullmqJobs>;

// WARN: PROXIES INITIALIZE LATE
// if something needs a worker early, i need to find a solution to await the inizialization of poolproxy

const bullmqPool1Init = async (instance: FastifyInstance) => {
  const poolOptions: WorkerPoolOptions = {
    ...(instance.config.POOL_MIN_WORKERS !== undefined && {
      minWorkers: instance.config?.POOL_MIN_WORKERS,
    }),
    ...(instance.config.POOL_MAX_WORKERS !== undefined && {
      maxWorkers: instance.config.POOL_MAX_WORKERS,
    }),
  };

  bullmqPool1 = createPool(
    fileURLToPath(new URL('jobs.js', import.meta.url)),
    poolOptions
  );

  bullmqPool1Proxy = await bullmqPool1.proxy();

  instance.log.info(
    `🐂 Bullmq worker pool 1 initialized [minThreads: ${
      poolOptions.minWorkers
    },  maxThreads: ${poolOptions.maxWorkers}, totalWorkers: ${
      bullmqPool1.stats().totalWorkers
    }]`
  );
};

export { bullmqPool1, bullmqPool1Init, bullmqPool1Proxy };
