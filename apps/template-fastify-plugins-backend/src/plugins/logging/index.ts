// import fastifySentry from '@immobiliarelabs/fastify-sentry';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginAsync = async (fastify) => {
  // grafana/loki is done in the logger option in fastify.ts

  fastify.log.warn(
    'todo: implement logging plugin with loki grafana and sentry'
  );

  // https://daily.dev/blog/error-logging-with-sentry-on-fastify

  /**
   * ## Sentry for error reporting
   * not working
   * e.g. this.Sentry.captureMessage('Blocked user tried to get in');
   */
  // await fastify.register(fastifySentry, {
  //     dsn: fastify.env.SENTRY_DSN,
  //     environment: 'production',
  //     release: '1.0.0',
  // });
};

const logging = fp(plugin, {
  name: 'logging',
  dependencies: ['environment', 'config'],
});

export default logging;
