// import compress from '@fastify/compress';
import accepts from '@fastify/accepts';
import middie from '@fastify/middie';
import fastifySchedulePlugin from '@fastify/schedule';
import sensible from '@fastify/sensible';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { logFastifyStats } from './simpleScheduler.js';
import { statusCodes } from './statusCodes.js';

const plugin: FastifyPluginAsync = async (fastify) => {
  /**
   * ## COMPRESS
   * compresses all requests by default, can be disabled with { global: false }
   * SHOULD PREFER ROUTER COMPRESSION (nginx, caddy, etc).
   * Remember that thanks to the Fastify encapsulation model, you can set a
   * global compression, but run it only in a subset of routes if you wrap them inside a plugin.
   * Important note! If you are using @fastify/compress plugin together with
   * @fastify/static plugin, you must register the @fastify/compress (with global hook)
   * before registering @fastify/static.
   *
   * injects option in get('/', {compress: opts})
   */
  // await fastify.register(compress, { global: true });

  /**
   * ## Add express middleware support (req, res, next)
   * can now use fastify.use((req, res, next) => {})
   */
  await fastify.register(middie, {
    hook: 'onRequest', // default
  });

  /**
   * ## SENSIBLE defaults
   * has reply.notFound() and reply.badRequest() etc.
   * has throw fastify.httpErrors.notFound() etc.
   * fastify.httpErrors.createError(404, 'This video does not exist!')
   * new createError.NotFound()
   */
  await fastify.register(sensible);

  /**
   * ## ACCEPTS
   * decorates req with req.accepts()
   */
  await fastify.register(accepts);

  /**
   * TODO: fix this
   *
   * ## Custom status codes - not working
   * use res.ok() instead of res.status(200).send()
   */
  // const statuses = Object.entries(statusCodes);
  // for (const [key, value] of Object.entries(statusCodes)) {
  //     fastify.decorateReply(key, async function (this: FastifyReply) {
  //         // await this.status(value).send(content);
  //         void this.status(value);
  //         return this;
  //     });
  // }

  await fastify.register(fastifySchedulePlugin);

  if (fastify.env.NODE_ENV !== 'production') {
    fastify.addHook('onReady', () => {
      fastify.scheduler.addSimpleIntervalJob(logFastifyStats);
    });
  }

  fastify.decorate('statusCodes', statusCodes);

  fastify.log.info('🚧 utils plugin loaded!');
};

declare module 'fastify' {
  export interface FastifyInstance {
    statusCodes: typeof statusCodes;
  }
  // export interface FastifyReply {
  //     statusCodes: typeof statusCodes;
  // }
}

const utils = fp(plugin, {
  name: 'utils',
});

export default utils;
