/* eslint-disable unicorn/prefer-module */
import {
  // createHash,
  randomBytes,
} from 'node:crypto';

import bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { worker } from 'workerpool';

import { easyEncrypt } from '../helpers/crypto';
import { Logger } from '../loggers';
// const { AppError } = require('../helpers');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

// CHECK COMMENTS IN WORKERPOOL1, THIS FILE IS NOT REALLY NEEDED
// ALSO THE BCRYPT IMPORT DOESN'T WORK

// const SALT_WORK_FACTOR = 12;

// ! CAN'T INJECT TS DIRECTLY INTO NODE, EITHER BUILD TS OR SERVE JS DIRECTLY

const testFibonacci = function testFibonacci(fibNumber: number) {
  // return new Promise((res) => {
  // make a fibonacci function
  const fib = (n: number): number => {
    if (n <= 2) return 1;
    return fib(n - 1) + fib(n - 2);
  };
  const result = fib(fibNumber);
  // console.log(result, 'result from workerpool1');

  // res(fib(fibNumber));
  return result;
  // };
  // });
};

// const sayHelloPool = () => {
//     console.log('hello from workerPool1');
// };

// TODO: bad DRY ( can reuse functions here ) no need to write twice
const encryptPasswordWorker = async function encryptPassword(
  password: any,
  saltDifficulty: any
) {
  Logger.debug('encryptPasswordWorker');
  // console.log('using worker pool for: encryptPasswordWorker');
  const result = {
    password,
    // eslint-disable-next-line unicorn/no-null
    error: null,
    hash: undefined as string | undefined,
  };

  // result.hash = await bcrypt.hash(password, saltDifficulty);
  bcrypt.hash(password, saltDifficulty, (err, hash) => {
    if (err) {
      throw err;
    }
    result.hash = hash;
  });
  return result;
};

const comparePasswordWorker = async function checkUser(
  candidatePassword: string,
  hash: string
) {
  Logger.debug('comparePasswordWorker');
  // console.log('using worker pool for: comparePasswordWorker');
  //... fetch user from a db etc.

  // const isMatch = await bcrypt.compare(candidatePassword, hash);
  // return isMatch;
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

const signTokenWorker = async function signJWT(payload: any) {
  // console.log('using worker pool for: signTokenWorker');
  Logger.debug('signTokenWorker');
  return new Promise((resolve, reject) => {
    // const token = sign(
    sign(
      // { id: payload },
      // JSON.parse(payload),
      payload,
      JWT_SECRET as any,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
      (err, asyncToken) => {
        if (err) reject(err);
        resolve(asyncToken);
      }
    );
  });
};

const verifyTokenWorker = async function signJWT(token: any) {
  // console.log('using worker pool for: verifyTokenWorker');
  Logger.debug('verifyTokenWorker');

  return new Promise((resolve, reject) => {
    verify(token, JWT_SECRET as any, {}, (err, decoded: any) => {
      // if (err) throw err;
      // if (err) reject(new AppError('invalid token', 401)); ( can't import ts file here)
      if (err) {
        // const errMessage =
        //     err.message === 'jwt expired'
        //         ? 'Session expired, please login again.'
        //         : err.message === 'invalid signature'
        //         ? 'invalid token, please login or signup'
        //         : 'Something went wrong. Please login or signup';

        // we handle the error in the global error handler
        reject(new Error(err as any));

        // we want to resolve to throw AppError in typescript ( reject would not be an operational error )
        // resolve({
        //     message: err.message,
        // });
      }

      if (decoded) resolve(decoded);
    });
  });
};

const generateRandomBytesWorker = async function generateRandomBytes(
  bytes: any
) {
  Logger.debug('generateRandomBytesWorker');

  return new Promise((resolve, reject) => {
    randomBytes(bytes, (err, buf) => {
      // resolve the error to throw in the main thread
      if (err)
        // resolve({
        //     err,
        // });
        reject(new Error(err as any));
      resolve(buf.toString('hex'));
    });
  });
};

// TODO: we are reusing the same function in the crypto file. DRY
// const easyEncryptWorker = async function easyEncrypt(token: any) {
//     return createHash('sha256').update(token).digest('hex');
// };
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/require-await
const easyEncryptWorker = async (token: any) => {
  Logger.debug('easyEncryptWorker');

  return easyEncrypt(token);
};

worker({
  easyEncryptWorker,
  encryptPasswordWorker,
  generateRandomBytesWorker,
  comparePasswordWorker,
  verifyTokenWorker,
  signTokenWorker,
  testFibonacci,
  // sayHelloPool,
});
