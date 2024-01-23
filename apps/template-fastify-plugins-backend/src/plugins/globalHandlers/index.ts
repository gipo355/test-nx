import * as Sentry from '@sentry/node';
import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const globalHandlers: FastifyPluginAsync = async function errors(fastify) {
  const { log, env } = fastify;

  Sentry.init({
    dsn: env.SENTRY_DSN,
    // ...
  });

  log.warn('todo: implement errors plugin for global error handler');

  /**
   * ## This module will handler 404 globally
   */
  // Set not found handler, serving 404.html with static
  // prevent 404 scouting with rate limiter
  fastify.setNotFoundHandler(
    {
      preHandler: fastify.rateLimit({
        max: 4,
        timeWindow: 500,
      }),
    },
    async (_reqRateLimit, reply) =>
      // reply.code(404).notFound();
      // reply.status(404).sendFile('404.html')
      // TODO: change to sendFile
      reply.status(404).send('Not found')
  );

  /**
   * ## This module will customize the global error handler if needed
   * ## GLOBAL ERROR HANDLER, catches all thrown errors.
   * built in instance validation errors are handled automatically
   * (errors are thrown up here)
   * if you set a global error handler, automatic error handling will be disabled
   */

  // TODO: handler global errors. must be trusted to not leak sensitive info
  fastify.setErrorHandler((error, _, reply) => {
    if (env.NODE_ENV === 'production') Sentry.captureException(error);

    /**
     * ## default is
     */
    // for instance schema validation code ( automatically )
    // {
    // "statusCode": 400,
    // "code": "FST_ERR_VALIDATION",
    // "error": "Bad Request",
    // "message": "body must have required property 'name'"
    //  }

    //  for external thrown errors like mongoose
    //  {
    // "statusCode": 500,
    // "code": "11000",
    // "error": "Internal Server Error",
    // "message": "E11000 duplicate key error collection:
    // test_database.animals index: name_1 dup key: { name: \"snake\" }"
    //  }
    //  you can define schema per route, and use the errorHandler route
    //  option to handle errors

    //  this is the global error handler where requests end

    //  validaton errors don't get logged as errors

    // log.error('globalErrorHandler in app.ts');
    // log.error(error);

    return reply.send(error);

    // TODO: handle what errors are thrown here.

    // the default
    // if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
    //     return reply.send(error);
    // }
    // if (error instanceof Fastify.errorCodes.FST_ERR_NOT_FOUND) {
    //     return reply.send(error);
    // }
    // if (error.code === 'FST_ERR_VALIDATION') {
    //     return reply.send(error);
    // }

    // catch all untrusted errors
    // return reply.send(
    //     httpErrors.internalServerError(
    //         'There was an error, please try again later'
    //     )
    // );
  });
};

export default fp(globalHandlers, {
  name: 'errors',
  dependencies: ['limiter', 'environment', 'config', 'utils'],
});
