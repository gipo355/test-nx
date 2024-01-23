import {
  // afterAll,
  // beforeAll,
  describe,
  expect,
  test,
} from 'vitest';

import { hashPassword } from './hashPassword.js';

describe('Auto hash password', () => {
  const password = '123456';
  let hash: string;
  test('should hash password', async () => {
    hash = await hashPassword(password);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(10);
  });
});
