import { Client } from 'undici';
import {
  // beforeAll,
  describe,
  // expect,
  // test,
} from 'vitest';

import { TEST_PORT } from '../../config.js';

let client: Client;
// let app: ReturnType<typeof buildFastify>;
beforeAll(() => {
  // app = buildFastify();
  // await app.listen({
  //     port: 3000,
  // });

  // TODO: find a way to get secrets from the instance?
  // client = new Client(`http://localhost:${Number(SECRETS.PORT) + 1}`, {
  client = new Client(`http://localhost:${TEST_PORT}`, {
    keepAliveTimeout: 10,
    keepAliveMaxTimeout: 10,
  });
});
afterAll(async () => {
  await client.close();
  // await app.close();
});

describe.concurrent.todo('/auth/', () => {});
