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

  bcrypt.hash(password, saltDifficulty, (err, hash) => {
    if (err) {
      throw err;
    }
    result.hash = hash;
  });

  return result;
};

export const comparePassword = async function checkUser(
  candidatePassword: string,
  hash: string
) {
  //... fetch user from a db etc.

  let isMatch = false;
  bcrypt.compare(candidatePassword, hash, (err, same) => {
    if (err) {
      throw err;
    }
    isMatch = same;
    return isMatch;
  });
  return isMatch;
};

export const easyEncrypt = function easyEncrypt(token: string) {
  return createHash('sha256').update(token).digest('hex');
};
