// import 'dotenv-defaults/config';

import { Worker } from 'bullmq';
import mongoose from 'mongoose';
import { worker } from 'workerpool';

import { redisConnection } from '../database/redis';
import { Logger } from '../loggers';
// import { resizeImage } from '../helpers/imageManipulation';
// import { Logger } from '../loggers';
import { bullmqMailWorkerJob } from './bullmqMailWorkerJob';

/**
 * ## IMP: connecting to mongo from worker pool to be able to reset token upon error ( worker pool does not have access to main connection )
 */
const {
  // WORKER_POOL_ENABLED = 0,
  NATOUR_MONGO_CONNECTION_STRING,
  NATOUR_MONGO_PASSWORD,
} = process.env;
if (!NATOUR_MONGO_PASSWORD || !NATOUR_MONGO_CONNECTION_STRING)
  Logger.error('Missing env variables for bullmqWorkerInPool.ts');
const mongoAuthString = NATOUR_MONGO_CONNECTION_STRING?.replace(
  '<PASSWORD>',
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  NATOUR_MONGO_PASSWORD!
);
mongoose.set('strictQuery', false);
if (mongoAuthString) await mongoose.connect(mongoAuthString, {});

/**
 * ## Init the worker
 */
const bullmqWorkerInPoolInit = () =>
  new Worker(
    'bullmqQueue1',
    bullmqMailWorkerJob,
    // `${__dirname}/emailWorker.js`,
    // emailWorker1URL,
    {
      // autorun: false,
      connection: redisConnection,
    }
  );

/**
 * ## Init the worker as soon as the file is loaded ( no need to call it like the woker1)
 */
const bullmqWorkerInPool = bullmqWorkerInPoolInit();

const closeMqWorkerInPool = async () => {
  await bullmqWorkerInPool.close();
};

// eslint-disable-next-line unicorn/prefer-module, import/no-default-export
// export default async (job: SandboxedJob) => {
//     // Do something with job

//     console.log(job);
//     console.log(job.data);
//     console.log('email worker completed a job');
// };

/**
 * ## Adding the image processing here
 */

worker({
  closeMqWorkerInPool,
  // resizeImageWorker,
});
