import viewEngine from '@fastify/view';
import ejs from 'ejs';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

/**
 * ## Rendering for emails, SSR, etc.
 */
const plugin: FastifyPluginAsync = async (fastify) => {
  // TODO: rendering should be done in a worker
  /**
   * ## VIEWS, can go normal path with ejs, pug or use react with nextjs
   * possibility of using fastify/vite fastify/next
   * SSR should be done by astro or nextjs or other specific framework
   * better to just use ejs standalone for emails only
   * [https://blog.logrocket.com/fastify-vite-serving-vite-ssr-hydration/]
   * [https://github.com/fastify/fastify-nextjs] doesn't work
   */
  await fastify.register(viewEngine, {
    engine: {
      ejs,
    },
    root: './views/', // relative to root project
    // defaultContext: {
    //     siteName: 'Fastify Template',
    // },
  });

  fastify.log.info('🎨 Frontend registered');
};

const frontend = fp(plugin, {
  name: 'frontend',
  dependencies: ['config', 'environment'],
});

export default frontend;
