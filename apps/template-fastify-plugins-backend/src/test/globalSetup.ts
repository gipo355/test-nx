/**
 * ## This will run globally once before all tests
 * has a separate scope, runs in its own process
 * must be activated in vitest.config.ts
 */

// eslint-disable-next-line import/extensions
import 'dotenv-defaults/config.js';

import { execSync } from 'node:child_process';

// eslint-disable-next-line n/no-unpublished-import, import/no-extraneous-dependencies
import dockerCompose from 'docker-compose';

import { fastify } from '../fastify.js';
// eslint-disable-next-line import/no-relative-packages
import { isPortReachable } from '../plugins/utils/isPortReachable.js';

fastify.log.info('🌐 global-setup');

const buildTestEnvironment = async () => {
  // ️️️✅ Best Practice: Speed up during development, if already live then do nothing
  const isDBReachable = await isPortReachable({ port: 5432 });

  if (!isDBReachable) {
    // ️️️✅ Best Practice: Start the infrastructure within a test hook - No failures occur because the DB is down
    await dockerCompose.upAll({
      cwd: new URL('../..', import.meta.url).pathname,
      log: true,
    });

    // await dockerCompose.exec(
    //     'database',
    //     ['sh', '-c', 'until pg_isready ; do sleep 1; done'],
    //     {
    //         cwd: path.join(__dirname),
    //     }
    // );

    // ️️️✅ Best Practice: Use npm script for data seeding and migrations
    execSync('npx prisma migrate dev');
    // ✅ Best Practice: Seed only metadata and not test record, read "Dealing with data" section for further information
    // execSync('npx prisma run db:seed');
  }

  // 👍🏼 We're ready
  fastify.log.info('🌐 global-setup: done');
};

/**
 * ## This is a shared setup hook from globalSetup
 */
const setup = async () => {
  await buildTestEnvironment();
};

const teardown = async () => {};

export { setup, teardown };
