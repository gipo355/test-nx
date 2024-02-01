/* eslint-disable unicorn/prefer-module */
const { worker } = require('workerpool');
const bcrypt = require('bcrypt');

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
  //... fetch user from a db etc.

  const isMatch = await bcrypt.compare(candidatePassword, hash);

  return isMatch;
};

worker({
  encryptPasswordWorker,
  comparePasswordWorker,
  // sayHelloPool,
});
