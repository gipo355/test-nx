import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { createPrisma } from './createPrisma.js';

const plugin: FastifyPluginAsync = async (fastify) => {
  const prisma = createPrisma(fastify);

  await prisma.$connect();

  // eslint-disable-next-line unicorn/no-null
  // fastify.decorateRequest('prisma', null); // docs suggest to do this
  // fastify.addHook('onRequest', (request, _, done) => {
  //     request.prisma = prisma;
  //     done();
  // });
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
  });

  fastify.log.info('🔍 Prisma plugin registered');
};

/**
 * ## Add prism types to fastify instance
 */
declare module 'fastify' {
  // export interface FastifyRequest {
  //     prisma: typeof prisma;
  // }
  export interface FastifyInstance {
    prisma: ReturnType<typeof createPrisma>;
  }
}

const psql = fp(plugin, {
  name: 'psql',
  dependencies: ['environment', 'config'],
});

export default psql;
