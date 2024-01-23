import type { FastifyPluginAsync } from 'fastify';

import { handler } from './handler.js';

const tours: FastifyPluginAsync = async function users(fastify) {
  fastify.log.warn('todo tours');

  /**
   * ## Multiple params also possible here
   * TODO: make an example with reviews
   */

  /**
   * ## Tours
   */
  fastify.route({
    url: '/',
    method: 'GET',
    schema: {
      tags: ['tours'],
    },
    handler,
  });
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      tags: ['tours'],
    },
    handler,
  });
  fastify.route({
    url: '/',
    method: 'PATCH',
    schema: {
      tags: ['tours'],
    },
    handler,
  });
  fastify.route({
    url: '/',
    method: 'DELETE',
    schema: {
      tags: ['tours'],
    },
    handler,
  });
};

export default tours;
