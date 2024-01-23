import { Type } from '@sinclair/typebox';
import { type FastifyPluginAsync } from 'fastify';

import { logoutHandler } from './logout.js';
import { logoutAllHandler } from './logoutAll.js';
import { refreshHandler, refreshSchema } from './refresh.js';
import { validateHandler, validateSchema } from './validate.js';

/**
 * ## Exporting an autoPrefix variable overrides default auto prefixing
 * based on folder structure
 */
// export const autoPrefix = '/api/v1';

const auth: FastifyPluginAsync = async function auth(fastify): Promise<void> {
  const { oauth2SignupHandler, authenticate } = fastify;

  /**
   * ## We are using middie to add express like middleware support
   * There is no order. this middleware triggers for the above route aswell
   */
  // fastify.use((_req, _res, next) => {
  //     log.debug('middleware use');
  //     next();
  // });

  /**
   * ## Encapsulation: we are using a plugin here.
   * This is a plugin that is scoped to the current instance.
   * Every route and plugin inside this auth plugin will have access to this.
   * It won't propagate above because auth itself is not wrapped inside
   * fastify-plugin.
   *
   * there is no order. this middleware triggers for the above route aswell
   */
  // await fastify.register(
  //     fp(async (instance) => {
  //         instance.addHook('onRequest', (_req, _res, done) => {
  //             log.debug('onRequest hook');
  //             done();
  //         });
  //     })
  // );

  /**
   * ## GET /api/v1/auth/github/callback
   * GITHUB OAUTH2
   */
  fastify.route({
    url: '/github/callback',
    method: 'GET',
    schema: {
      tags: ['auth'],
      response: {
        200: Type.Object({
          csrfToken: Type.String(),
          accessToken: Type.String(),
          refreshToken: Type.String(),
        }),
      },
    },
    handler: oauth2SignupHandler('GITHUB'),
    // preHandler
    // onRequest
    // preParsing,
    // preValidation
    // preSerialization,
    // errorHandler: registerErrorHandler,
  });

  /**
   * ## GET /api/v1/auth/github/callback
   * GOOGLE OAUTH2
   */
  fastify.route({
    url: '/google/callback',
    method: 'GET',
    schema: {
      tags: ['auth'],
      response: {
        200: Type.Object({
          csrfToken: Type.String(),
          accessToken: Type.String(),
          refreshToken: Type.String(),
        }),
      },
    },
    handler: oauth2SignupHandler('GOOGLE'),
    // preHandler
    // onRequest
    // preParsing,
    // preValidation
    // preSerialization,
    // errorHandler: registerErrorHandler,
  });

  /*
   * ## GET /logout
   */
  fastify.route({
    url: '/logout',
    method: 'GET',
    schema: {
      tags: ['auth'],
    },
    handler: logoutHandler,
    // preHandler
    // onRequest
    // preParsing,
    // preValidation
    // preSerialization,
    // errorHandler:
  });

  /*
   * ## GET /logout-all
   */
  fastify.route({
    url: '/logout-all',
    method: 'GET',
    schema: {
      tags: ['auth'],
    },
    handler: logoutAllHandler,
    // preHandler
    // onRequest
    // preParsing,
    // preValidation
    // preSerialization,
    // errorHandler:
  });

  /**
   * ## GET /refresh
   */
  fastify.route({
    url: '/validate',
    method: 'GET',
    schema: validateSchema,
    handler: validateHandler,
    // preHandler
    onRequest: fastify.auth([authenticate]),
    // preParsing,
    // preValidation
    // preSerialization,
    // errorHandler:
  });

  /**
   * ## GET /refresh
   */
  fastify.route({
    url: '/refresh',
    method: 'GET',
    schema: refreshSchema,
    handler: refreshHandler,
    // preHandler
    // onRequest
    // preParsing,
    // preValidation
    // preSerialization,
    // errorHandler:
  });

  /**
   * ## POST /api/v1/auth/register
   * not implementing this. using oauth2 for login
   */
  // fastify.route({
  //     url: '/register',
  //     method: 'POST',
  //     schema: registerSchema,
  //     handler: registerHandler,
  //     // preHandler
  //     // onRequest
  //     // preParsing,
  //     // preValidation
  //     // preSerialization,
  //     errorHandler: registerErrorHandler,
  // });

  /**
   * ## POST /forgot-password
   * not implementing this. using oauth2 for login
   */
  // fastify.route({
  //     url: '/forgot-password',
  //     method: 'POST',
  //     schema: {
  //         tags: ['auth'],
  //     },
  //     handler,
  //     // preHandler
  //     // onRequest
  //     // preParsing,
  //     // preValidation
  //     // preSerialization,
  //     // errorHandler:
  // });

  /**
   * ## POST login
   * not implementing this. using oauth2 for login
   */
  // fastify.route({
  //     url: '/login',
  //     method: 'POST',
  //     schema: {
  //         tags: ['auth'],
  //     },
  //     handler,
  //     // preHandler
  //     // onRequest
  //     // preParsing,
  //     // preValidation
  //     // preSerialization,
  //     // errorHandler:
  // });

  /**
   * ## PATCH /reset-password/:token
   * not implementing this. using oauth2 for login
   */
  // fastify.route({
  //     url: '/update-password/:token',
  //     method: 'PATCH',
  //     schema: {
  //         tags: ['auth'],
  //     },
  //     handler,
  //     // preHandler
  //     // onRequest
  //     // preParsing,
  //     // preValidation
  //     // preSerialization,
  //     // errorHandler:
  // });

  /**
   * ## GET /verify-email/:token
   * not implementing this. using oauth2 for login
   */
  // fastify.route({
  //     url: '/verify-email/:token',
  //     method: 'GET',
  //     schema: {
  //         tags: ['auth'],
  //     },
  //     handler,
  //     // preHandler
  //     // onRequest
  //     // preParsing,
  //     // preValidation
  //     // preSerialization,
  //     // errorHandler:
  // });

  /**
   * ## PATCH /update-password
   * not implementing this. using oauth2 for login
   */
  // fastify.route({
  //     url: '/update-password',
  //     method: 'PATCH',
  //     schema: {
  //         tags: ['auth'],
  //     },
  //     handler,
  //     // preHandler
  //     // onRequest
  //     // preParsing,
  //     // preValidation
  //     // preSerialization,
  //     // errorHandler:
  // });
};

export default auth;
