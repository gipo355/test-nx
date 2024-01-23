import fastifyElastic from '@fastify/elasticsearch';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const plugin: FastifyPluginAsync = async function connectDatabase(
  fastify: FastifyInstance
) {
  await fastify.register(fastifyElastic, {
    node: 'http://localhost:9200',
    // healthcheck: false,
  });

  fastify.log.info(
    'Connected to elastic, decorated fastify instance with elastic'
  );
};

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
const elastic = fastifyPlugin(plugin, {
  name: 'elastic',
  dependencies: ['environment', 'config'],
});

export { elastic };
