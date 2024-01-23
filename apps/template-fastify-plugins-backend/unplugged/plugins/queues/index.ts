// import type { Job } from 'bullmq';
import { Queue, Worker as BullmqWorker } from 'bullmq';
import type { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { Redis } from 'ioredis';

// import {
//     bullmqPool1,
//     bullmqPool1Init,
//     bullmqPool1Proxy,
// } from './bullmqPool1.js';
import { bullmqJob1 } from './job1.js';
// import { bullmqJob1 } from './job1.js';

const plugin: FastifyPluginAsync = async function plugin(fastify) {
  const redisConnectionBullmq = new Redis(fastify.env.REDIS_URL, {
    // eslint-disable-next-line unicorn/no-null
    maxRetriesPerRequest: null, // from the docs, suggested for pub/sub
  });

  const queue1 = new Queue('bullmqQueue1', {
    connection: redisConnectionBullmq,
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
   * ## Setup the worker pool for the job
   */
  // await bullmqPool1Init(fastify);

  /**
   * ## Create the job function, using a worker pool
   */
  // const sendEmailJob = async (job: Job) => {
  //     await bullmqPool1Proxy.job1(job);
  // };

  // TODO: bullmq won't work in worker threads
  // close the pool. use the email but do the rendering from pug in the worker pool
  /**
   * ## Create new worker which will delegate the job
   * to the pool initialized above
   */
  const worker1 = new BullmqWorker('bullmqQueue1', bullmqJob1, {
    connection: redisConnectionBullmq,
    autorun: true,
    useWorkerThreads: true,
  });

  fastify.decorate('bullmq', {
    redis: redisConnectionBullmq, // this is needed to close the connection
    queues: {
      queue1, // this is used to add jobs to the queue
    },
    workers: {
      worker1, // this is used to close the bull worker
    },
    // pools: {
    //     pool1: bullmqPool1, // this is used to close the worker pool
    //     proxy1: bullmqPool1Proxy, // this is used to execute the job
    // },
    closeBullWithGrace: async () => {
      await worker1.close();
      await redisConnectionBullmq.quit();
      // await bullmqPool1.terminate();
    },
  });

  fastify.addHook('onClose', async (instance) => {
    await instance.bullmq.closeBullWithGrace();
  });

  fastify.log.info('🐂 Redis BullMQ connected, workers activated');
};

declare module 'fastify' {
  export interface FastifyInstance {
    bullmq: {
      redis: Redis;
      queues: {
        queue1: Queue;
      };
      workers: {
        worker1: BullmqWorker;
      };
      // pools: {
      //     pool1: typeof bullmqPool1;
      //     proxy1: typeof bullmqPool1Proxy;
      // };

      /*
       * @description
       * Close the bullmq connection, workers and pools with grace
       *
       */
      closeBullWithGrace: () => Promise<void>;
    };
  }
}

const queues = fastifyPlugin(plugin, {
  name: 'queues',
  dependencies: ['environment', 'config'],
});

export default queues;
