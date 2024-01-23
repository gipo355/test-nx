import fastifySwagger, { type SwaggerOptions } from '@fastify/swagger';
import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

// hide a route with { hide: true } in the route schema

const swaggerOptions: SwaggerOptions = {
  mode: 'dynamic',
  // openapi: {
  //     openapi: '3.0.3',
  // },
  hiddenTag: 'hide',
  // routePrefix: '/api/docs',

  swagger: {
    info: {
      title: 'Test swagger',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'users', description: 'User related end-points' },
      { name: 'auth', description: 'auth endpoints' },
      { name: 'tours', description: 'tours endpoints' },
      // { name: 'code', description: 'Code related end-points' },
      { name: 'animals', description: 'Animal related end-points' },
      { name: 'views', description: 'Views related end-points' },
      { name: 'ui', description: 'Frontend' },
      { name: 'system', description: 'System related end-points' },
    ],
    // should probably make some global types to share
    definitions: {
      User: {
        type: 'object',
        required: ['id', 'email'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
    },
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header',
      },
      Bearer: {
        type: 'apiKey',
        name: 'Bearer',
        in: 'header',
      },
      Csrf: {
        type: 'apiKey',
        name: 'x-csrf-token',
        in: 'header',
      },
    },
  },

  // let's expose the documentation only in development
  // it's up to you decide who should see this page,
  // but it's alwaysx better to start safe.
  // exposeRoute: true,
};

const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  // uiHooks: {
  //     onRequest(request, reply, next) {
  //         next();
  //     },
  //     preHandler(request, reply, next) {
  //         next();
  //     },
  // },
  // staticCSP: true,
  // transformStaticCSP: (header) => header,
  // transformSpecification: (swaggerObject, request, reply) =>
  //     swaggerObject,
  // transformSpecificationClone: true,
};

const plugin: FastifyPluginAsync = async function plugin(fastify) {
  await fastify.register(fastifySwagger, swaggerOptions);

  if (fastify.config.SWAGGER_UI_ENABLED)
    await fastify.register(swaggerUi, swaggerUiOptions);

  fastify.log.info('📚 Swagger UI registered');
};

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
const swagger = fp(plugin, {
  name: 'swagger',
  dependencies: ['environment', 'config'],
});

export default swagger;
