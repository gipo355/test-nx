import { Client } from 'undici';
import {
  // beforeAll,
  describe,
  // expect,
  // test,
} from 'vitest';

import { TEST_PORT } from '../../config.js';

// import { buildFastify } from '../app.js';

let client: Client;
// let app: ReturnType<typeof buildFastify>;
beforeAll(() => {
  // app = buildFastify();
  // await app.listen({
  //     port: 3000,
  // });
  client = new Client(`http://localhost:${TEST_PORT}`, {
    keepAliveTimeout: 10,
    keepAliveMaxTimeout: 10,
  });
});
afterAll(async () => {
  await client.close();
  // await app.close();
});

describe.concurrent('/healthz', () => {
  test('GET: should return 200', async () => {
    const response = await client.request({
      method: 'GET',
      path: '/healthz',
      // headers: {
      //     'Content-Type': 'application/json',
      // },
      // body: JSON.stringify({
      //     name: Date.now().toString(),
      // }),
    });
    // const response = await app.inject({
    //     method: 'POST',
    //     url: '/api/v1/animals',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         name: Date.now().toString(),
    //     }),
    // });
    expect(response.statusCode).toBe(200);
    // expect(true).toBe(true);
  });
  test('GET: should return 404', async () => {
    const response = await client.request({
      method: 'GET',
      path: '/hhealthz',
    });
    expect(response.statusCode).toBe(404);
  });
});
