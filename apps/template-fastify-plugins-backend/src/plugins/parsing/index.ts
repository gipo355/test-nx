import formBodyParser from '@fastify/formbody';
import multipart from '@fastify/multipart';
import urlData from '@fastify/url-data';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginAsync = async (fastify) => {
  /**
   * ## FORM BODY PARSER
   */
  await fastify.register(formBodyParser, {
    // bodyLimit: 1048576, // 1 MiB, default is choosen by fastify global server opts
  });

  /**
   * ## URL DATA
   */
  await fastify.register(urlData);

  /**
   * ## check docs to add pump + use circuit breaker
   */
  await fastify.register(multipart, {
    // limits: {
    //     fieldNameSize: 100, // Max field name size in bytes
    //     fieldSize: 100, // Max field value size in bytes
    //     fields: 10, // Max number of non-file fields
    //     headerPairs: 2000, // Max number of header key=>value pairs
    //     files: 1, // Max number of file fields
    //     fileSize: 1_000_000, // For multipart forms, the max file size in bytes
    // },
  });

  fastify.log.info('📦 Parsing registered');
};

const parsing = fp(plugin, {
  name: 'parsing',
});

export default parsing;
