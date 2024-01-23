import { Client } from 'undici';
import {
  // beforeAll,
  describe,
  // expect,
  // test,
} from 'vitest';

import { TEST_PORT } from '../../../../test/config.js';

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

describe.concurrent.todo('/api/v1/users', () => {
  // describe.concurrent('POST', () => {
  //     test('should create user', async () => {
  //         const response = await client.request({
  //             method: 'POST',
  //             path: '/api/v1/users',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //                 name: Date.now().toString(),
  //                 email: `${Date.now().toString()}@mailsac.com`,
  //                 password: '12345678',
  //                 passwordConfirm: '12345678',
  //             }),
  //         });
  //         // const response = await app.inject({
  //         //     method: 'POST',
  //         //     url: '/api/v1/animals',
  //         //     headers: {
  //         //         'Content-Type': 'application/json',
  //         //     },
  //         //     body: JSON.stringify({
  //         //         name: Date.now().toString(),
  //         //     }),
  //         // });
  //         expect(response.statusCode).toBe(201);
  //     });
  // });
  // describe.concurrent('GET', () => {
  //     test('should get users', async () => {
  //         const response = await client.request({
  //             method: 'GET',
  //             path: '/api/v1/users',
  //         });
  //         const body = await response.body.json();
  //         expect(response.statusCode).toBe(200);
  //         expect(body).toBeDefined();
  //     });
  //     test('should be wrong route userss', async () => {
  //         const response = await client.request({
  //             method: 'GET',
  //             path: '/api/v1/userss',
  //         });
  //         expect(response.statusCode).toBe(404);
  //     });
  // });
});

describe.concurrent.todo('/api/v1/users/:userId/tours', () => {
  // describe.concurrent('GET', () => {
  //     test('should find tours for a user', async () => {
  //         const response = await client.request({
  //             method: 'GET',
  //             path: '/api/v1/users',
  //         });
  //         const body = await response.body.json();
  //         expect(response.statusCode).toBe(200);
  //         expect(body).toBeDefined();
  //     });
  //     test('should return 404', async () => {
  //         const response = await client.request({
  //             method: 'GET',
  //             path: '/api/v1/userss',
  //         });
  //         expect(response.statusCode).toBe(404);
  //     });
  // });
});
