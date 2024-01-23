import type { FastifyPluginAsync } from 'fastify';

import { handler } from './handler.js';

const users: FastifyPluginAsync = async function users(fastify) {
  fastify.log.warn('todo users');

  /**
   * ## Multiple params also possible here
   */
  // fastify.route({
  //     url: '/:userId/tours',
  //     method: 'GET',
  //     handler,
  // });

  /**
   * ## Users routes
   */
  fastify.route({
    url: '/me',
    schema: {
      tags: ['users'],
    },
    method: 'GET',
    handler,
  });
  fastify.route({
    url: '/me',
    schema: {
      tags: ['users'],
    },
    method: 'PATCH',
    handler,
  });
  fastify.route({
    url: '/me',
    schema: {
      tags: ['users'],
    },
    method: 'DELETE',
    handler,
  });

  /**
   * ## find a way restrict to admins from here below
   */
  fastify.route({
    url: '/',
    method: 'GET',
    schema: {
      tags: ['users'],
    },
    handler,
  });
  fastify.route({
    url: '/:userId',
    method: 'GET',
    schema: {
      tags: ['users'],
    },
    handler,
  });
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      tags: ['users'],
    },
    handler,
  });
  fastify.route({
    url: '/:userId',
    method: 'DELETE',
    schema: {
      tags: ['users'],
    },
    handler,
  });
  fastify.route({
    url: '/:userId',
    method: 'PATCH',
    schema: {
      tags: ['users'],
    },
    handler,
  });
};

export default users;
