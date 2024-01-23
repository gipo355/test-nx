import { Job, Queue, Worker as BullmqWorker } from 'bullmq';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Redis } from 'ioredis';

import { Email } from './Email.js';

/**
 * ## Email service using bullmq and workerpool to render templates
 */
const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.log.info('📧 Email plugin registered');

  const EmailService = new Email(fastify);

  const redisConnectionEmails = new Redis(fastify.env.REDIS_URL, {
    // eslint-disable-next-line unicorn/no-null
    maxRetriesPerRequest: null, // from the docs, suggested for pub/sub
  });

  const queue1 = new Queue<TBullEmailJobData>('Queue1', {
    connection: redisConnectionEmails,
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

  const emailJob = async (job: Job<TBullEmailJobData>) => {
    // console.log('email job', job.data);

    const {
      options: { firstName, url, to },
      type,
    } = job.data;

    await EmailService.sendEmail(type, {
      firstName,
      url,
      to,
    });
  };

  const emailBullWorker = new BullmqWorker<TBullEmailJobData>(
    'Queue1',
    emailJob,
    {
      connection: redisConnectionEmails,
      autorun: true,
      // useWorkerThreads: true,
    }
  );

  fastify.decorate('emails', {
    redis: redisConnectionEmails, // this is needed to close the connection
    queues: {
      queue1, // this is used to add jobs to the queue
    },
    workers: {
      emailBullWorker, // this is used to close the bull worker
    },
    // pools: {
    //     pool1: bullmqPool1, // this is used to close the worker pool
    //     proxy1: bullmqPool1Proxy, // this is used to execute the job
    // },
    closeBullWithGrace: async () => {
      await emailBullWorker.close();
      await redisConnectionEmails.quit();
      // await bullmqPool1.terminate();
    },
  });

  fastify.addHook('onClose', async (instance) => {
    await instance.emails.closeBullWithGrace();
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    emails: {
      redis: Redis;
      queues: {
        queue1: Queue<TBullEmailJobData>;
      };
      workers: {
        emailBullWorker: BullmqWorker<TBullEmailJobData>;
      };
      closeBullWithGrace: () => Promise<void>;
    };
  }
}

const email = fp(plugin, {
  name: 'email',
  dependencies: ['environment', 'config', 'workerpools'],
});

export default email;
