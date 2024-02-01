/* eslint-disable unicorn/prefer-module */
const { worker } = require('workerpool');
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 12;
// const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);

// ! CAN'T INJECT TS DIRECTLY INTO NODE, EITHER BUILD TS OR SERVE JS DIRECTLY

const encryptPassword = async function encryptPassword(password) {
  // log(password, 'worker 1 input');
  //
  // console.log(password);
  // let newPassword = password;
  const result = {
    password,
    // eslint-disable-next-line unicorn/no-null
    error: null,
  };

  result.password = await bcrypt.hash(password, SALT_WORK_FACTOR);
  return result;
  // ! async, problems
  // // generate a salt
  // bcrypt.genSalt(SALT_WORK_FACTOR, function generateSalt(err, salt) {
  //     if (err) {
  //         result.error = err;
  //         return result;
  //     }

  //     // hash the password using our new salt
  //     bcrypt.hash(
  //         result.password,
  //         salt,
  //         function hashFunction(errsecondErr, hash) {
  //             if (errsecondErr) {
  //                 result.error = errsecondErr;
  //                 return result;
  //             }
  //             // override the cleartext password with the hashed one
  //             result.password = hash;
  //             log(hash, 'hash');
  //             log(salt, 'salt');
  //             // log(result, 'output result');
  //             // return JSON.stringify(result);
  //             return 'hello';
  //             // return result.password;
  //         }
  //     );
  // });
  // return 'hello';

  // result.password = bcrypt.hash(password, SALT_WORK_FACTOR, (err, hash) => {
  //     if (err) {
  //         result.error = err;
  //         return result;
  //     }
  //     result.password = hash;
  //     return result;
  // });

  // ! sync
  // const hash = bcrypt.hashSync(newPassword, salt);
  // // result.password = hash;
  // newPassword = hash;
  // return result;
  // return newPassword;
};

const comparePassword = async function checkUser(hash, password) {
  //... fetch user from a db etc.

  const isMatch = await bcrypt.compare(password, hash);

  // if (isMatch) {
  //     //login
  // }
  return isMatch;

  //...
};

worker({
  encryptPassword,
  comparePassword,
});
