import { isMainThread } from 'node:worker_threads';

import type { Job } from 'bullmq';

export const bullmqJob1 = async (job: Job) => {
  try {
    // await job.log('Start processing job');
    // console.log('Start processing job');
    console.info({
      thread: isMainThread ? 'main' : 'worker',
      message: 'bullmq test queue job',
      data: job.data,
      id: job.id,
    });

    // console.log('bullmq test queue job:', job.id, job.data);
  } catch (error) {
    console.error({
      thread: 'worker',
      message: 'bullmq test queue job error',
      data: job.data,
      id: job.id,
      error,
    });
  }
};
