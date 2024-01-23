import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginAsync = async (instance) => {
  instance.log.warn('todo: implement trpc plugin');
};

const logging = fp(plugin, {
  name: 'trpc',
  dependencies: ['environment', 'config'],
});

export default logging;
