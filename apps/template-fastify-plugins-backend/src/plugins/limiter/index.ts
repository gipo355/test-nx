// import circuitBreaker from '@fastify/circuit-breaker';
import fastifyLimiter from '@fastify/rate-limit';
import underPressure from '@fastify/under-pressure';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Redis } from 'ioredis';
// import throttle from '@fastify/throttle';

const plugin: FastifyPluginAsync = async (fastify) => {
  const redisConnectionLimiter = new Redis(fastify.env.REDIS_URL, {
    // connectionName: 'my-connection-name',
    //   host: 'localhost',
    //   port: 6379,

    // settings suggested by docs
    connectTimeout: 500,
    maxRetriesPerRequest: 1,
  });

  /**
   * ## Rate Limiting
   * can be added to route with { config: { rateLimit: { }}
   */
  // NOTE: await is required here to access fastify.rateLimit()
  await fastify.register(fastifyLimiter, {
    global: true,
    allowList: ['127.0.0.1'],
    redis: redisConnectionLimiter,
    max: 50,
    timeWindow: '1 minute',
  });
  /**
   * ## SET NOT FOUND HANDLER WITH RATE LIMIT TO PREVENT SCOUTING FOR ROUTES
   * doesn't work obviously
   */
  // fastify.setNotFoundHandler(async (_req, reply) => {
  //     await reply.code(404).send();
  // });

  // fastify.setNotFoundHandler(
  //     {
  //         preHandler: fastify.rateLimit({
  //             max: 4,
  //             timeWindow: 500,
  //         }),
  //     },
  //     async (_req, reply) => {
  //         await reply.code(404).send();
  //     }
  // );

  fastify.decorate('rateLimiter', {
    redis: redisConnectionLimiter,
  });

  /**
   * ## THROTTLE
   */
  // void fastify.register(throttle, {
  //     bytesPerSecond: 1024 * 1024, // 1MB/s
  //     streamPayloads: true, // throttle the payload if it is a stream
  //     bufferPayloads: true, // throttle the payload if it is a Buffer
  //     stringPayloads: true, // throttle the payload if it is a string
  // });

  /**
   * ## UNDER PRESSURE
   * can add logic  if (fastify.isUnderPressure()) { skip complex computation }
   */
  await fastify.register(underPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 100_000_000,
    maxRssBytes: 300_000_000,
    maxEventLoopUtilization: 0.98,
    message: 'Under pressure!',
    retryAfter: 50,
    // customError: CustomError,
    pressureHandler: (_req, _res, type, value) => {
      if (type === underPressure.TYPE_HEAP_USED_BYTES) {
        fastify.log.warn(`too many heap bytes used: ${value}`);
      } else if (type === underPressure.TYPE_RSS_BYTES) {
        fastify.log.warn(`too many rss bytes used: ${value}`);
      }
    },
    exposeStatusRoute: {
      routeOpts: {
        // logLevel: 'debug',
        logLevel: 'info',
        config: {
          someAttr: 'value',
        },
      },
      routeSchemaOpts: {
        // If you also want to set a custom route schema
        // hide: true,
        tags: ['system'],
      },
      url: '/healthz', // If you also want to set a custom route path and pass options ( healthz )
      // routeResponseSchemaOpts: {
      //     // extraValue: { type: 'string' },
      //     metrics: {
      //         type: 'object',
      //         properties: {
      //             eventLoopDelay: { type: 'number' },
      //             rssBytes: { type: 'number' },
      //             heapUsed: { type: 'number' },
      //             eventLoopUtilized: { type: 'number' },
      //         },
      //     },
      //     // ...
      // },

      // healthCheckInterval: 500,
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    // healthCheck: async (fastifyInstance) =>
    //     // extraValue: await getExtraValue(),
    //     ({
    //         metrics: fastifyInstance.memoryUsage(),
    //     }),
    // healthCheck: async function (fastifyInstance) {
    //     // do some magic to check if your db connection is healthy, etc...
    //     return true;
    // },
  });

  /**
   * ## CIRCUIT BREAKER
   */
  // void fastify.register(circuitBreaker);

  fastify.addHook('onClose', async (instance) => {
    await instance.rateLimiter.redis.quit();
  });

  fastify.log.info('🚓 limiter plugin registered');
};

declare module 'fastify' {
  export interface FastifyInstance {
    rateLimiter: {
      redis: Redis;
    };
  }
}

const limiter = fp(plugin, {
  name: 'limiter',
  dependencies: ['config', 'environment'],
});

export default limiter;
