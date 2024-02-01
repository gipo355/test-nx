/**
 * ## ALTERNATIVE FUNCTION TO POOL WORKER
 * used if worker pool is not enabled
 */
import { Worker } from 'bullmq';

import { redisConnection } from '../database/redis';
// import { sendEmail } from '../helpers';
import { Logger } from '../loggers';
import { bullmqMailWorkerJob } from '../workers/bullmqMailWorkerJob';

export const bullmqWorkerInit = () => {
  Logger.info('bullmq normal worker activated');
  return new Worker(
    'bullmqQueue1',
    bullmqMailWorkerJob,
    // `${__dirname}/emailWorker.js`,
    // emailWorker1URL,
    {
      // autorun: false,
      connection: redisConnection,
    }
  );
};

export const closeMqWorker = async () => {
  await bullmqWorkerInit().close();
};
