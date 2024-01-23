import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginAsync = async (instance) => {
  instance.log.warn('todo: implement imagekit or s3');
};

const storage = fp(plugin, {
  name: 'storage',
  dependencies: ['environment', 'config'],
});

export default storage;
