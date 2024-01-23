/* eslint-disable n/no-process-exit */
import fp from 'fastify-plugin';

/**
 * ## Import the atoms to build the app ⚛️
 */
import app from './app.js';
import { fastify, logger } from './fastify.js';

export const main = async () => {
  const now = new Date();
  fastify.log.info(`Initializing...`);
  /**
   * ## Build app 🍏
   */
  await fastify.register(fp(app));

  /**
   * ## Graceful shutdown 🌱
   * I built my own graceful shutdown, but you can use plugins like fastify-graceful-shutdown
   * or close-with-grace (built in fastify-cli).
   * Every plugin that needs to close something must have and onClose hook
   * encapsulated.
   */
  const shutdownGracefully = async () => {
    await fastify.close();

    logger.info('Server closed gracefully ✅');
  };

  process.on('uncaughtException', (err) => {
    void (async () => {
      logger.error('uncaught exception');
      logger.error(err);
      setTimeout(() => {
        process.exit(0);
      }, 5000);
      await shutdownGracefully();
    })();
  });

  process.on('unhandledRejection', (reason, promise) => {
    void (async () => {
      logger.error('unhandled rejection');
      logger.error(reason);
      logger.error(promise);

      setTimeout(() => {
        process.exit(0);
      }, 5000);

      await shutdownGracefully();
    })();
  });

  process.on('SIGTERM', (err) => {
    void (async () => {
      console.error(err);
      setTimeout(() => {
        // process.kill(process.pid, 'SIGKILL');
        process.exit(0);
      }, 5000);
      await shutdownGracefully();
      // process.kill(process.pid, 'SIGINT');
    })();
  });

  process.on('SIGINT', () => {
    void (async () => {
      logger.info('SIGINT signal received.');
      logger.info('Closing http server.');

      setTimeout(() => {
        process.exit(0);
      }, 5000);

      await shutdownGracefully();
    })();
  });

  /**
   * ## Start server 🚀
   */
  // if (process.env.VITE !== 'true') // for vite-plugin-node
  fastify.log.info('🚀 Starting server...');
  await fastify.listen({
    port: Number.isFinite(Number(fastify.env.PORT))
      ? Number(fastify.env.PORT)
      : 3000,
    host: '127.0.0.1',
  });

  fastify.log.info(`Completed in ${Date.now() - now.getTime()}ms`);
  return fastify;
};

/**
 * ## For vite-plugin-node
 */
export const viteNodeApp = main();
