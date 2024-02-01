/**
 * ## ALTERNATIVE FUNCTION TO POOL WORKER
 * used if worker pool is not enabled
 */
import { createHash } from 'node:crypto';

import bcrypt from 'bcrypt';

// TODO: bad DRY ( can reuse functions here ) no need to write twice
export const encryptPassword = async function encryptPassword(
  password: string,
  saltDifficulty: number
) {
  const result = {
    password,
    // eslint-disable-next-line unicorn/no-null
    error: null,
    hash: '',
  };

  result.hash = await bcrypt.hash(password, saltDifficulty);

  return result;
};

export const comparePassword = async function checkUser(
  candidatePassword: string,
  hash: string
) {
  //... fetch user from a db etc.

  const isMatch = await bcrypt.compare(candidatePassword, hash);

  return isMatch;
};

export const easyEncrypt = function easyEncrypt(token: string) {
  return createHash('sha256').update(token).digest('hex');
};
