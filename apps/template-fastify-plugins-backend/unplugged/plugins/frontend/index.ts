import fastifyStatic from '@fastify/static';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

/**
 * ## Here i will work on the frontend
 * either serving static files, or using vite or sveltekit
 * or serving html in general
 * rendering is separated because it could be used for backend stuff
 * like emails, etc.
 */
const plugin: FastifyPluginAsync = async (fastify) => {
  /**
   * ## Static files
   * PREFER USING A CDN FOR SERVING STATIC FILES OR NGINX/CADDY
   * // TODO: static doesn't work with caching plugin
   */
  await fastify.register(fastifyStatic, {
    root: new URL('../../../../build', import.meta.url).pathname,
    // root: new URL('../../../../build/client/_app', import.meta.url)
    //     .pathname,
    // root: new URL('../../../assets/', import.meta.url).pathname,
    // root: new URL('../../../public/', import.meta.url).pathname,
    // prefix: '/_app',
    // cacheControl: false,
    // immutable: false,
    // maxAge: '1d',
  });

  fastify.log.info('🎨 Frontend registered');
};

const frontend = fp(plugin, {
  name: 'frontend',
  dependencies: ['config', 'environment'],
});

export default frontend;
