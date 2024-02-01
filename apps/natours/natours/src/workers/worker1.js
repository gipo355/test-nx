/* eslint-disable unicorn/prefer-module */
const { worker } = require('workerpool');
const bcrypt = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const { randomBytes, createHash } = require('node:crypto');
// const { AppError } = require('../helpers');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

// CHECK COMMENTS IN WORKERPOOL1, THIS FILE IS NOT REALLY NEEDED
// ALSO THE BCRYPT IMPORT DOESN'T WORK

// const SALT_WORK_FACTOR = 12;

// ! CAN'T INJECT TS DIRECTLY INTO NODE, EITHER BUILD TS OR SERVE JS DIRECTLY

// const sayHelloPool = () => {
//     console.log('hello from workerPool1');
// };

const encryptPasswordWorker = async function encryptPassword(
  password,
  saltDifficulty
) {
  // console.log('using worker pool for: encryptPasswordWorker');
  const result = {
    password,
    // eslint-disable-next-line unicorn/no-null
    error: null,
    hash: undefined,
  };

  result.hash = await bcrypt.hash(password, saltDifficulty);
  return result;
};

const comparePasswordWorker = async function checkUser(
  candidatePassword,
  hash
) {
  // console.log('using worker pool for: comparePasswordWorker');
  //... fetch user from a db etc.

  const isMatch = await bcrypt.compare(candidatePassword, hash);

  return isMatch;
};

const signTokenWorker = async function signJWT(payload) {
  // console.log('using worker pool for: signTokenWorker');
  // console.log(payload);
  return new Promise((resolve, reject) => {
    // const token = sign(
    sign(
      // { id: payload },
      JSON.parse(payload),
      JWT_SECRET,
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

const verifyTokenWorker = async function signJWT(token) {
  // console.log('using worker pool for: verifyTokenWorker');
  return new Promise((resolve, reject) => {
    verify(token, JWT_SECRET, {}, (err, decoded) => {
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
        reject(new Error(err));

        // we want to resolve to throw AppError in typescript ( reject would not be an operational error )
        // resolve({
        //     message: err.message,
        // });
      }

      if (decoded) resolve(decoded);
    });
  });
};

const generateRandomBytesWorker = async function generateRandomBytes(bytes) {
  return new Promise((resolve) => {
    randomBytes(bytes, (err, buf) => {
      // resolve the error to throw in the main thread
      if (err)
        // resolve({
        //     err,
        // });
        reject(new Error(err));
      resolve(buf.toString('hex'));
    });
  });
};

const easyEncryptWorker = async function easyEncrypt(token) {
  return createHash('sha256').update(token).digest('hex');
};

worker({
  easyEncryptWorker,
  encryptPasswordWorker,
  generateRandomBytesWorker,
  comparePasswordWorker,
  verifyTokenWorker,
  signTokenWorker,
  // sayHelloPool,
});
