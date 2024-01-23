import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('example', () => 'example');
};

const example = fp(plugin, {
  name: 'example',
  dependencies: ['config', 'environment'],
});

export default example;
