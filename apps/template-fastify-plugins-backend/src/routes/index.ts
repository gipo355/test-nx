import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

// import { v1Router } from './modules/api/v1/api.v1.router.js';

/**
 * ## This module is for complex redirects
 * and handling global middlewares
 */

const routes: FastifyPluginAsync = async function viewsRouter(
  fastify: FastifyInstance
) {
  // NOTE: api is usually hosted under api.example.com/v1

  /**
   * ## Example: nested routes redirect to specific handler
   */
  await fastify.register(import('./api/index.js'), {
    // prefix: '/users/:userId/tours',
    prefix: '/v1/',
  });

  await fastify.register(import('./auth/index.js'), {
    prefix: '/auth/',
  });

  await fastify.register(import('./frontend/index.js'), {});

  // TODO: static under / and spa under /_app?
};

export default routes;
