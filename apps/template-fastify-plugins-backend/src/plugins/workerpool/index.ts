import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { pool1, pool1Init, pool1Proxy } from './workerPool1.js';

const plugin: FastifyPluginAsync = async (fastify) => {
  await pool1Init(fastify);

  fastify.decorate('workerpools', {
    pool1, // this is used to close the worker pool
    proxy1: pool1Proxy, // this is used to execute the jobs
  });

  fastify.addHook('onClose', async (instance) => {
    await instance.workerpools.pool1.terminate();
  });

  fastify.log.info('👷 Workerpools plugin registered');
};

declare module 'fastify' {
  export interface FastifyInstance {
    workerpools: {
      pool1: typeof pool1;
      proxy1: typeof pool1Proxy;
    };
  }
}

const workerpools = fp(plugin, {
  name: 'workerpools',
  dependencies: ['environment', 'config'],
});

export default workerpools;
