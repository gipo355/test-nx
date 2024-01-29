// import path from 'node:path';
// import { fileURLToPath } from 'node:url';

import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyLoggerOptions } from 'fastify';
import Fastify from 'fastify';
// import type { FastifyLoggerStreamDestination } from 'fastify/types/logger.js';
import { pino } from 'pino';

// const filename = fileURLToPath(import.meta.url);
// const dirname = path.dirname(filename);

// TODO: should logging be done by a worker?

/**
 * ## This fastify instance is separated to be able to use the logger before
 * secrets initialization and before building the app
 *
 * It must be available to main.ts, app and tests
 * and is used to pass the config opts
 */

// const fastifyLoggerOptionsProd: FastifyLoggerOptions = {
//     level: 'warn',
//     file: new URL('../logs/fastify.log', import.meta.url).pathname,
// };
// const fastifyLoggerOptionsDev = {
//     transport: {
//         target: 'pino-pretty',
//         options: {
//             // translateTime: 'HH:MM:ss.s Z',
//             ignore: 'pid,hostname',
//         },
//     },
//     level: 'debug',
// };
// const fastifyLoggerOptionsDev = true;
// const fastifyLoggerOptionsDev = {
//     level: 'info',
//     timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
//     disableRequestLogging: true,
//     transport: {
//         target: 'pino-pretty',
//     },
// };
// const loggerOptions =
//     process.env.NODE_ENV === 'production'
//         ? fastifyLoggerOptionsProd
//         : fastifyLoggerOptionsDev;

const streams = [
  {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    // levels: {
    //     debug: 1,
    //     info: 1,
    //     warn: 2,
    //     error: 3,
    //     fatal: 4,
    // },
    stream: pino.transport({
      target: 'pino-pretty',
      // levels: {
      //     trace: 0,
      //     debug: 1,
      //     info: 2,
      //     warn: 3,
      //     error: 4,
      //     fatal: 5,
      // },
      options: {
        // translateTime: 'HH:MM:ss.s Z',
        ignore: 'pid,hostname',
        // destination: 1,
      },
    }),
  },
  // {
  //     level: 'warn',
  //     stream: pino.transport({
  //         target: 'pino/file',
  //         options: {
  //             destination: path.join(dirname, '../logs/fastify.log'),
  //             mkdir: true,
  //         },
  //         // file: path.join(dirname, '../logs/fastify.log'),
  //     }),
  // },
  // https://skaug.dev/node-js-app-with-loki/
  // grafana UI will be on http://localhost:3200 and will contain all logs
  // TODO: remote and security
  {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    stream: pino.transport({
      target: 'pino-loki',
      // levels: {
      //     trace: 0,
      //     debug: 1,
      //     info: 2,
      //     warn: 3,
      //     error: 4,
      //     fatal: 5,
      // },
      options: {
        host: 'http://localhost:3100', // Change if Loki hostname is different
        labels: { application: 'fastify-test-application' },
      },
    }),
  },
];

const fastifyLoggerOptions: FastifyLoggerOptions = {
  stream: pino.multistream(streams),
};

/**
 * ## Fastify Instance Options
 */
export const fastifyOptions = {
  // logger: loggerOptions,
  logger: fastifyLoggerOptions,
  bodyLimit: 102_400, // 100kb = 102400 bytes
  trustProxy: 1,
  ignoreTrailingSlash: true,
  // onProtoPoisoning: 'error', // default
  // maxParamLength: 100, // default
  // onConstructorPoisoning: 'error', // default

  // if using big plugins like fastify/next
  // pluginTimeout: process.env.NODE_ENV === 'development' ? 120_000 : undefined, // handle possible big plugins like next
};

const fastify = Fastify(fastifyOptions).withTypeProvider<TypeBoxTypeProvider>();

const logger = fastify.log;

export { fastify, logger };
