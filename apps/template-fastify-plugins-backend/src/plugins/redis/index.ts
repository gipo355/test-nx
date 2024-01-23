import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Redis } from 'ioredis';

const plugin: FastifyPluginAsync = async function connectDatabase(
  fastify: FastifyInstance
) {
  /**
   * ## General purpose redis connection
   * every plugin has its own redis connection (auth, bull, caching)
   * We can use this connection for general use instead
   */
  const redisConnection = new Redis(fastify.env.REDIS_URL);

  fastify.decorate('redis', redisConnection);

  fastify.addHook('onClose', async (instance) => {
    await instance.redis.quit();
  });

  fastify.log.info('🧱 Redis plugin registered');
};

/**
 * ## Add redis types to fastify instance
 */
declare module 'fastify' {
  export interface FastifyInstance {
    redis: Redis;
  }
}

const redis = fp(plugin, {
  name: 'redis',
  dependencies: ['environment', 'config'],
});

export default redis;
