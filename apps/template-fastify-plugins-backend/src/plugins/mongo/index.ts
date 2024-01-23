import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { Animal } from './Animal.js';
import { mongoose } from './mongo.js';

const mongoSchemas = {
  Animal,
};

const plugin: FastifyPluginAsync = async function plugin(fastify) {
  await mongoose.connect(fastify.env.MONGO_URL);

  /**
   * ## Decorate fastify with schemas
   * Initialize a decorator as a '' if the intended value is a string, and as null if it will be an object or a function.
   * The decorated Fastify server is bound to this in route route handlers ( can't use arrow functions in route handlers if i need it ).
   * the decorations will be available to all requests, MUTATIONS ARE PROBLEMS. use encapsulation like below
   */
  fastify.decorate('mongo', mongoose); // decorate fastify server instance
  // fastify.decorateReply('mongo', mongoose); // decorate reply object

  // eslint-disable-next-line unicorn/no-null
  fastify.decorateRequest('mongo', null); // decorate request object
  fastify.addHook('onRequest', (req, _, done) => {
    req.mongo = mongoSchemas;
    done();
  });

  fastify.addHook('onClose', async (instance) => {
    await instance.mongo.disconnect();
  });

  fastify.log.info('♿ mongo plugin registered');
};

declare module 'fastify' {
  export interface FastifyInstance {
    mongo: typeof mongoose;
  }
  export interface FastifyRequest {
    mongo: typeof mongoSchemas;
  }
}

const mongo = fp(plugin, {
  name: 'mongo',
  dependencies: ['environment', 'config'],
});

export default mongo;
