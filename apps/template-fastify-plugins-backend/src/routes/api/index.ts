import path from 'node:path';
import { fileURLToPath } from 'node:url';

import AutoLoad from '@fastify/autoload';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
/**
 * ## This module is for complex redirects
 * and handling global middlewares
 */

const apiV1: FastifyPluginAsync = async function viewsRouter(
  fastify: FastifyInstance
) {
  /**
   * ## Example: nested routes redirect to specific handler
   * NOTE: loads the module twice
   */
  // await fastify.register(import('./v1/tours/index.js'), {
  //     prefix: '/users/:userId/tours',
  // });

  await fastify.register(AutoLoad, {
    dirNameRoutePrefix: true,
    forceESM: true,
    dir: path.join(dirname, 'v1'),

    /**
     * ## Include only index.js files, allowing more room for customization
     */
    ignoreFilter: (filePath) => !filePath.endsWith('index.js'),
  });
};

export default apiV1;
