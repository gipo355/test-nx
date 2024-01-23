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

describe.concurrent('/api/v1/animals', () => {
  describe.concurrent('POST', () => {
    test('should return 201', async () => {
      const response = await client.request({
        method: 'POST',
        path: '/v1/animals',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: Date.now().toString(),
        }),
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
      expect(response.statusCode).toBe(201);
    });
  });
  describe.concurrent('GET', () => {
    test('should return 200', async () => {
      const response = await client.request({
        method: 'GET',
        path: '/v1/animals',
      });
      const body = await response.body.json();
      expect(response.statusCode).toBe(200);
      expect(body).toBeDefined();
    });
    test('should return 404', async () => {
      const response = await client.request({
        method: 'GET',
        path: '/v1/animalss',
      });
      expect(response.statusCode).toBe(404);
    });
  });
});
