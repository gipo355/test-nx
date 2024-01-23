// import { Type } from '@sinclair/typebox';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import {
  AccessTokenPayloadSchema,
  CompiledAccessTokenPayloadSchema,
} from './schemas.js';

const plugin: FastifyPluginAsync = async (fastify) => {
  const { log } = fastify;

  // fastify.addSchema(
  //     Type.Object(
  //         {
  //             hello: Type.String(),
  //         },
  //         {
  //             $id: 'http://example.com/',
  //         }
  //     )
  // );
  //     fastify.post('/', {
  //   handler () {},
  //   schema: {
  //     body: {
  //       type: 'array',
  //       items: { $ref: 'http://example.com#/properties/hello' }
  //     }
  //   }
  // })

  // fastify.addSchema({
  //     $id: 'schemaId',
  //     type: 'object',
  //     properties: {
  //         hello: { type: 'string' },
  //     },
  // });
  // fastify.addSchema(
  //     Type.Object({ hello: Type.String() }, { $id: 'schemaId' })
  // );
  // const mySchemas = fastify.getSchemas();
  // const mySchema = fastify.getSchema('schemaId');

  fastify.addSchema(AccessTokenPayloadSchema);

  fastify.decorate('schemas', {
    AccessTokenPayloadSchema,
  });

  fastify.decorate('compiledSchemas', {
    AccessTokenPayloadSchema: CompiledAccessTokenPayloadSchema,
  });

  log.info('Schemas registered');
};

declare module 'fastify' {
  interface FastifyInstance {
    schemas: {
      AccessTokenPayloadSchema: typeof AccessTokenPayloadSchema;
    };
    compiledSchemas: {
      AccessTokenPayloadSchema: typeof CompiledAccessTokenPayloadSchema;
    };
  }
}

const schemas = fp(plugin, {
  name: 'schemas',
});

export default schemas;
