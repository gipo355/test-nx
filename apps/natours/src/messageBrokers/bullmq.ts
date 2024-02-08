/* eslint-disable unicorn/prefer-module */
import { Job, type JobsOptions, Queue } from 'bullmq';

import { redisConnection } from '../database/redis';
import { type JobDataCustom } from '../workers/bullmqMailWorkerJob';

interface CustomEmailQueue extends Queue {
  add: (
    name:
      | 'passwordResetEmail'
      | 'sendWelcomeEmail'
      | 'sendMessageEmail'
      | 'emailConfirmation',
    data: JobDataCustom,
    options?: JobsOptions
  ) => Promise<Job<any, any, string>>;
}

// TODO: bad DRY ( can reuse functions here ) no need to write twice the worker
export const bullmqQueue1: CustomEmailQueue = new Queue('bullmqQueue1', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnFail: 2500,
    removeOnComplete: 500,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

/**
 * ## NOTE: trying webpack fix
 * possible ways: use pool function inside the body;
 * create a pool for the worker alone
 * create a built in process by providing a worker
 */

// IMP: the worker is in the worker pool folder

/**
 * ## snippet to add to queue
 */
// await bullmqQueue1.add(
//     'email', // job name
//     { message: 'hello world', email: 'sad@gmail.com', token: randomToken },
//     { removeOnComplete: 500, removeOnFail: 2500 }
// );
// await bullmqQueue1.obliterate();
