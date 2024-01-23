import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginAsync = async (instance) => {
  instance.log.warn('todo: implement stripe payments');
};

const stripe = fp(plugin, {
  name: 'stripe',
  dependencies: ['environment', 'config'],
});

export default stripe;
