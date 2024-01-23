/**
 * ## This will run globally once before all tests
 * has a separate scope, runs in its own process
 * must be activated in vitest.config.ts
 */

// eslint-disable-next-line import/extensions
import 'dotenv-defaults/config.js';

import fp from 'fastify-plugin';

import app from '../app.js';
import { fastify } from '../fastify.js';
import { TEST_PORT } from './config.js';

export const setup = async () => {
  await fastify.register(fp(app));
  await fastify.listen({
    port: Number(TEST_PORT),
    host: '127.0.0.1',
  });

  fastify.log.info('setting up test server');
};

export const teardown = async () => {
  // await builtApp.close();
  fastify.log.info('teardown server');
  await fastify.close();
};
