import fastifyCaching from '@fastify/caching';
import absCache from 'abstract-cache';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Redis } from 'ioredis';

const plugin: FastifyPluginAsync = async (fastify) => {
  // IMP: something here was blocking fastify static response

  const redisConnectionCaching = new Redis(fastify.env.REDIS_URL);

  /**
   * ## CACHING
   * decorator fastify.cache.set(key, value, ttl)
   * decorator fastify.cache.get(key)
   */
  const abcache = absCache({
    useAwait: true,
    driver: {
      name: 'abstract-cache-redis', // must be installed via `npm i`

      options: { client: redisConnectionCaching },
    },
  });

  fastify.decorate('caching', {
    redis: redisConnectionCaching,
  });

  await fastify.register(fastifyCaching, {
    cache: abcache,
    // privacy: fastifyCaching.privacy.NOCACHE, -- define global cache rule for all routes
    // expiresIn: 300, -- define global cache rule for all routes
    // cacheSegment: 'segment-name',
  });

  fastify.addHook('onClose', async (instance) => {
    await instance.caching.redis.quit();
  });

  fastify.log.info('📝 Caching plugin registered');
};

declare module 'fastify' {
  export interface FastifyInstance {
    caching: {
      redis: Redis;
    };
  }
}

const caching = fp(plugin, {
  name: 'caching',
  dependencies: ['environment', 'config'],
});

export default caching;
