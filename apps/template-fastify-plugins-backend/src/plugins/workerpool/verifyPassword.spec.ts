import {
  // afterAll,
  // beforeAll,
  describe,
  expect,
  test,
} from 'vitest';

import { hashPassword } from './hashPassword.js';
import { verifyPassword } from './verifyPassword.js';

describe('Auto hash password', async () => {
  const password = '123456';
  const hash = await hashPassword(password);
  test('should verify password', async () => {
    const isPasswordValid = await verifyPassword(hash, password);
    expect(isPasswordValid).toBe(true);
  });
});
