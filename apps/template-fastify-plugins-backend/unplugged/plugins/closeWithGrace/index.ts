import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

/**
 * ## NOTE: all this functionality is moved on onClose hooks in each plugin
 * this is not needed
 */

const plugin: FastifyPluginAsync = async (instance) => {
  // const closeWorkerPools = async () => {
  //     instance.log.info('Closing workers 🛑');

  //     // await instance.bullmq.workers.worker1.close();
  //     // await instance.bullmq.pools.pool1.terminate();
  //     // await instance.workerpools.pool1.terminate();

  //     instance.log.info('workers closed ✅');
  // };

  // const closeDatabaseConnections = async () => {
  //     instance.log.info('Closing database connections 🛑');

  //     // await instance.bullmq.redis.quit();
  //     // await instance.caching.redis.quit();
  //     // await instance.rateLimiter.redis.quit();
  //     // await instance.prisma.$disconnect();
  //     // await instance.mongo.disconnect();

  //     instance.log.info('Database connections closed ✅');
  // };

  instance.addHook('onClose', async () => {
    // await closeWorkerPools();
    // await closeDatabaseConnections();

    instance.log.info('app.onClose');
  });

  instance.log.info('closeWithGrace plugin registered');
};

const closeWithGrace = fp(plugin, {
  name: 'closeWithGrace',
  dependencies: [
    // 'bullmq',
    // 'workerpools',
    // 'caching',
    // 'limiter',
  ],
});

export default closeWithGrace;
