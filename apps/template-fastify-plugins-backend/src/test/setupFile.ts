/**
 * ## This will run before every test file if activated in vitest.config.ts
 */

// import { Client } from 'undici';
// import { testApiV1Animals } from './animal.spec.js';
// eslint-disable-next-line import/extensions
import 'dotenv-defaults/config.js';

// eslint-disable-next-line import/no-extraneous-dependencies
import { beforeAll, describe, expect, test } from 'vitest';

import { isPortReachable } from '../plugins/utils/isPortReachable.js';

beforeAll(() => {
  describe('Test Environment Up', () => {
    test('postgres is up', async () => {
      expect(await isPortReachable({ port: 5432 })).toBe(true);
      expect(true).toBe(true);
    });
    test('mongo is up', async () => {
      expect(await isPortReachable({ port: 27_017 })).toBe(true);
      expect(true).toBe(true);
    });
    test('redis is up', async () => {
      expect(await isPortReachable({ port: 6379 })).toBe(true);
      expect(true).toBe(true);
    });
  });
});
