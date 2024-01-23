import { type FastifyPluginAsync } from 'fastify';

import {
  getAllAnimalsErrorHandler,
  getAllAnimalsHandler,
  getAllAnimalsSchema,
} from './getAll.js';
import {
  getOneAnimalErrorHandler,
  getOneAnimalHandler,
  getOneAnimalSchema,
} from './getOne.js';
import {
  // postOneAnimalErrorHandler,
  postOneAnimalHandler,
  postOneAnimalSchema,
} from './post.js';

/**
 * ## Exporting an autoPrefix variable overrides default auto prefixing
 * based on folder structure
 */
// export const autoPrefix = '/api/v1';

const animals: FastifyPluginAsync = async function animals(
  fastify
): Promise<void> {
  /**
   * ## require authorization
   */
  // fastify.addHook('onRequest', fastify.authorize(['USER', 'ADMIN']));

  /**
   * ## GET /api/v1/animals
   */
  fastify.route({
    url: '/',
    method: 'GET',
    schema: getAllAnimalsSchema,
    handler: getAllAnimalsHandler,
    // preHandler
    // onRequest
    // preParsing,
    // preValidation
    // preSerialization,
    errorHandler: getAllAnimalsErrorHandler,
  });
  /**
   * ## GET /api/v1/animals/protected
   */
  fastify.route({
    url: '/protected',
    method: 'GET',
    schema: getAllAnimalsSchema,
    handler: getAllAnimalsHandler,
    // preHandler
    onRequest: fastify.auth([fastify.authenticate]),
    // preParsing,
    // preValidation
    // preSerialization,
    errorHandler: getAllAnimalsErrorHandler,
  });
  /**
   * ## GET /api/v1/animals/animalId
   */
  fastify.route({
    url: '/:animalId',
    method: 'GET',
    schema: getOneAnimalSchema,
    handler: getOneAnimalHandler,
    // preHandler
    // onRequest
    // preParsing,
    // preValidation
    // preSerialization,
    errorHandler: getOneAnimalErrorHandler,
  });
  /**
   * ## POST /api/v1/animals
   */
  fastify.route({
    url: '/',
    method: 'POST',
    schema: postOneAnimalSchema,
    handler: postOneAnimalHandler,
    // preHandler
    // onRequest
    // preParsing,
    // preValidation
    // preSerialization,
    // errorHandler: postOneAnimalErrorHandler,
  });
};

export default animals;
