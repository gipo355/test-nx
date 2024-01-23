import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import type { FastifyPluginAsync } from 'fastify';
import mongoSanitizer from 'fastify-mongodb-sanitizer';
import fp from 'fastify-plugin';
import DOMPurify from 'isomorphic-dompurify';

const plugin: FastifyPluginAsync = async (fastify) => {
  const { config } = fastify;
  /**
   * ## CORS, add here for all api, or move to specific route (not needed for frontend)
   * can be added to single route with { config: { cors: {}}
   */
  // TODO: for sveltekit, must add origins. in svelte must include credentials
  // for fetch requests to work
  // TODO: add origins for *example.com and localhost
  await fastify.register(cors, config.CORS_OPTIONS);

  /**
   * ## Helmet
   * some say it's not needed for the API in stackoverflow the creator says
   * some props added could actually be leaving it here to use globally
   * instead of frontend specific.
   * exposes helmet prop to route handlers to customize per route
   * also added to reply object as reply.helmet (e.g. disable frameguard)
   */
  await fastify.register(helmet, config.HELMET_OPTIONS);

  /**
   * ## MONGO SANITIZER
   */
  await fastify.register(mongoSanitizer, {
    params: true,
    query: true,
    body: true,
  });

  /**
   * ## ISOMORPHIC DOMPURIFY
   * run it before injecting, not on save to db
   */
  fastify.decorate('sanitize', DOMPurify.sanitize);

  fastify.log.info('🔒 Security registered');
};

declare module 'fastify' {
  export interface FastifyInstance {
    sanitize: typeof DOMPurify.sanitize;
  }
}

const security = fp(plugin, {
  name: 'security',
  dependencies: ['environment', 'config'],
});

export default security;
