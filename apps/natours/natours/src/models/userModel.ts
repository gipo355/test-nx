import mongoose from 'mongoose';
import isAscii from 'validator/lib/isAscii';
import isEmail from 'validator/lib/isEmail';

// import isURL from 'validator/lib/isURL';
import {
  LAST_MODIFIED_DELAY_MS,
  NEW_USER_EXPIRES_AT,
  RANDOM_BYTES_VALUE,
  RESET_TOKEN_EXPIRY_MINS,
  SALT_WORK_FACTOR,
  WORKER_POOL_ENABLED,
} from '../config';
import { autoComparePassword } from '../helpers';
import {
  // comparePassword,
  easyEncrypt,
  encryptPassword,
} from '../helpers/crypto';
// need to specify the exact path without imporitng the index file. this will be used by external script
// with no support for await
import { generateRandomBytes } from '../helpers/generateRandomBytes';
import { Logger } from '../loggers';
import { poolProxy } from '../workers';

// interface IUser {
//   name: string;
//   email: string;
//   photo: string;
//   role: string;
//   deletedAt: Date;
//   passwordResetToken: string;
//   passwordResetExpiry: Date;
//   password: string;
//   passwordLastModified: Date;
//   passwordConfirm: string;
//   active: boolean;
//   passwordChangedAt: Date;
// }
type IUser = Record<string, any>;

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'please tell us your name!'],
      trim: true,
      maxlength: [40, 'a username must be 40 or less chars'],
      minlength: [2, 'a username must be 2 or more chars'],
      validate: {
        validator: function validateName(value: string) {
          const rgx = /^[\w ]*[\da-z][\w ]*$/i;
          return rgx.test(value);
        },
        message: 'name can contain only letters or numbers',
      },
    },
    email: {
      type: String,
      required: [true, 'please enter your email'],
      unique: true,
      trim: true,
      lowercase: true,
      // maxlength: [40, 'a email must be 40 or less chars'],
      // minlength: [2, 'a email must be 2 or less chars'],
      validate: {
        validator: isEmail,
        message: 'Please insert a valid email address',
      },
    },
    photo: {
      type: String,
      // validate: {
      //   validator: isURL,
      //   message: 'insert an url',
      // },
      default: 'default.jpg',
    },
    // isAdmin: {
    //     type: Boolean,
    //     default: false,
    //     select: false,
    // },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      validate: [isAscii, 'invalid role input'],
      default: 'user',
      select: false,
    },
    passwordResetToken: {
      type: String,
      trim: true,
      select: false,
    },
    passwordResetExpiry: Date,
    password: {
      type: String,
      required: true,
      trim: true,
      maxlength: [40, 'a password must be 40 or less chars'],
      minlength: [8, 'a password must be 8 or more chars'],
      validate: {
        validator: isAscii,
        message: 'password must be an ASCII character',
      },
      select: false,
    },
    // passwordLastModified: {
    //     type: Date,
    //     // default: new Date().toISOString(), // initially set on creation, must be updated on every pw update
    // },
    passwordLastModified: Date,
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // ! careful!!! only works on save/create
        validator: function validatePw(value: string) {
          // only works on document creation ( no update )
          return (this as any).password === value;
        },
        message: 'passwords must match',
      },
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      trim: true,
      select: false,
    },
    expireAt: {
      type: Date,
      select: false,
      default: () => {
        const now = new Date();
        return new Date(now.getTime() + NEW_USER_EXPIRES_AT * 60 * 1000);
      },
    },
    active: {
      type: Boolean,
      default: true,
      select: false, // hide in the output
    },
    deletedAt: {
      type: Date,
      select: false,
    },
    // // hide v from queries and returned documents
    // __v: {
    //     type: Number,
    //     select: false,
    // },
  },
  // object for options, to show virtual properties
  {
    toJSON: {
      virtuals: true,
      /**
       * ## 2 possible ways to transform the output of JSON
       * When for exmaple we want to swap _id with id in every json output
       */
      // transform: (_document_, returnValue, options) => {
      //   delete returnValue.__v;
      //   returnValue.id = returnValue._id.toString();
      //   delete returnValue._id;
      // },
      // transform(_document_, returnValue) {
      //   // eslint-disable-next-line no-underscore-dangle, no-param-reassign
      //   delete returnValue._id;
      // },
    }, // each time we extract as JSON, we want to show virtuals
    toObject: { virtuals: true }, // show even when data is outputted as an object
  }
);

// virtual properties
// userSchema.virtual('durationWeeks').get(function getDurationWeeks() {
//     return this.duration / 7;
// });
/**
 * ## add virtual property ID to the schema from _id ( mongoose default )
 * NOT NEEDED, MONGOOSE ALREADY ADDS IT
 */
// userSchema.virtual('id').get(function getId() {
//   // eslint-disable-next-line no-underscore-dangle
//   return this._id;
// });

// pre, post hooks (query, aggregate, document)

// ! USE A WORKER POOL FOR CRYPTO OPERATIONS
userSchema.pre('save', async function preHook(next: any) {
  try {
    // ! only hash if password has been modified or is new ( same for reset token)

    // if (this.isModified('passwordResetToken')) {
    //     // we do this in the instance method
    //     // const encryptedToken = await (WORKER_POOL_ENABLED === '1'
    //     //     ? poolProxy.easyEncryptWorker(this.passwordResetToken)
    //     //     : easyEncrypt(this.passwordResetToken));
    //     // this.passwordResetToken = encryptedToken;
    //     // this.passwordResetExpiry = new Date(
    //     //     Date.now() + 1000 * 60 * RESET_TOKEN_EXPIRY_MINS
    //     // ).toISOString();
    //     // // NOTE: need to update pw modified too
    //     // this.passwordLastModified = new Date().toISOString();
    // }
    if (this.isModified('password')) {
      // ! worker pool doesn't work with webpack
      // const result = await workerPool1.exec('encryptPassword', [
      //     // eslint-disable-next-line unicorn/consistent-destructuring
      //     this.password,
      // ]);

      // ! worker pool try n2
      // const hash = await encryptPassword(this.password);
      // const hash = await workerPool1.exec(encryptPassword, [this.password]);
      // console.log(result);

      // useless, no errros can come out of the worker at the moment
      // if (result.error) throw new Error(result.error);
      // this.password = result.password;

      // this.password = await bcrypt.hash(this.password, SALT_WORK_FACTOR);

      // delete plain text confirm
      // this.password = result;

      // ! testing pool
      // eslint-disable-next-line no-inner-declarations
      // function sayHello(name: string) {
      //     // eslint-disable-next-line no-console
      //     console.log(`hi ${name} from worker pool`);
      // }
      // await pool.exec(sayHello, ['mark']);
      // const testPw = await pool.exec(encryptPassword, ['testpw']);
      // const testPw = await workerPool1.exec(encryptPassword, ['testpw']);
      // console.log(testPw);

      // await workerPool1.exec('sayHelloPool', []);
      // await workerPool1.exec(sayHello, ['mark']);

      // const pool = poolProxy;

      // ! worker pool test 3 - FIXED, WORKS

      let result: any;

      // eslint-disable-next-line unicorn/prefer-ternary
      if (WORKER_POOL_ENABLED === '1') {
        result = await poolProxy.encryptPasswordWorker(
          this.password,
          SALT_WORK_FACTOR
        );
      } else {
        result = await encryptPassword(this.password, SALT_WORK_FACTOR);
      }

      this.password = result.hash;

      this.passwordConfirm = undefined;
    }

    return next();
  } catch (error) {
    Logger.error(error);
    return next(error);
  }
});

userSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

/**
 * ## set deletedAt to current date
 * doesn't work with updates
 */
userSchema.pre('save', function preHook(next: any) {
  try {
    if (!this.isNew && this.active === true && this.isModified('active')) {
      this.deletedAt = new Date().toISOString();
    }

    next();
  } catch (error) {
    Logger.error(error);
    return next(error);
  }
});

userSchema.pre('save', function updatePasswordModified(next: any) {
  // fixing problem of new document
  if (this.isNew) return next();
  if (!this.isModified('password')) return next();

  // fixing conflict with json web token issuance date (last modified timestamp can be after the jwt issuance which would make it useless)
  // this.passwordLastModified = new Date(
  //     Date.now() - LAST_MODIFIED_DELAY_MS
  // ).toISOString(); // NOTE: must remove 1000 or conflicts with the json web token expiry. (iat in seconds)
  // trying with a simpler method
  this.passwordLastModified = Date.now() - LAST_MODIFIED_DELAY_MS;

  next();
});

// userSchema.methods.comparePassword = async function comparePassword(
//     candidatePassword: string,
//     next: any
// ) {
//     //

//     // let isValid: any;
//     const isValid = await (WORKER_POOL_ENABLED === '1'
//         ? poolProxy.comparePasswordWorker(candidatePassword, this.password)
//         : comparePassword(candidatePassword, this.password));
//     // return isValid;
//     // eslint-disable-next-line unicorn/no-null
//     if (!isValid) return next(new Error('password not valid'));
//     // return isValid
// };

// ! jonas implementation
userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  // this.password is not available; we select:false in the property

  /**
   * ## THIS GETS CALCULATED INSTANTLY AND BLOCKS EVERYTHING
   */
  // const shitPromise = new Promise((res) => {
  //     // make a fibonacci function
  //     const fib = (n: number): number => {
  //         if (n <= 2) return 1;
  //         return fib(n - 1) + fib(n - 2);
  //     };
  //     console.log('promise');
  //     res(fib(43));
  // });

  const isValid = await autoComparePassword(candidatePassword, userPassword);

  // const isValid: boolean = await (WORKER_POOL_ENABLED === '1'
  //     ? poolProxy.comparePasswordWorker(candidatePassword, userPassword)
  //     : comparePassword(candidatePassword, userPassword));
  // if (!isValid) return next(new Error('password not valid'));
  return isValid;
  // eslint-disable-next-line unicorn/no-null
  // return isValid
};

userSchema.methods.hasPasswordChangedSinceTokenIssuance =
  function hasPasswordChanged(iat: number) {
    // NOTE: without setting default ( efficiency, check only if prop exists )
    if (this.passwordLastModified) {
      // we need password creation or update time and token issuance timestamp
      // if iat <= changeTimeStamp, yes
      const tokenIssuedTime = new Date(iat * 1000);
      // console.log(tokenIssuedTime);
      // console.log(this.passwordLastModified);

      return tokenIssuedTime <= this.passwordLastModified; // if token issue time is smaller or equal than last modification time, it's been issued earlier than last pw modification
    }

    return false; // set default for new users
  };

userSchema.methods.createPasswordResetToken =
  async function createPasswordResetToken() {
    //
    // randomBytes();
    /**
     * ## generate random bytes to send to user
     */
    const generatedRandomToken = await (WORKER_POOL_ENABLED === '1'
      ? poolProxy.generateRandomBytesWorker(RANDOM_BYTES_VALUE)
      : generateRandomBytes(RANDOM_BYTES_VALUE));

    /**
     * ## encrypt token to save in db - we will confront the encrypted token in the db with the unencrypted one in the url ( by encrypting it )
     */
    const encryptedToken = await (WORKER_POOL_ENABLED === '1'
      ? poolProxy.easyEncryptWorker(generatedRandomToken)
      : easyEncrypt(generatedRandomToken));

    this.passwordResetToken = encryptedToken;
    this.passwordResetExpiry = new Date(
      Date.now() + 1000 * 60 * RESET_TOKEN_EXPIRY_MINS
    ).toISOString();

    // NOTE: need to update pw modified too to logout the user? no: only on pw update
    // this.passwordLastModified = new Date().toISOString();

    // IMP: we need to save here, we are not calling create or any other method in the controller
    // we do it in the controller ?
    // this.save();
    // await this.save({ validateBeforeSave: false }); // IMP: we need validateBeforeSave because otherwise it asks to insert all required fields

    // eslint-disable-next-line no-console
    // console.log({ generatedRandomToken, encryptedToken });

    return generatedRandomToken;
  };
userSchema.methods.clearPasswordResetToken =
  function clearPasswordResetToken() {
    this.passwordResetToken = undefined;
    this.passwordResetExpiry = undefined;
    // await this.save({ validateBeforeSave: false }); // IMP: we need validateBeforeSave because otherwise it asks to insert all required fields
  };

// not just find, any query that starts with find
// use function or this won't be pointing to the correct object
userSchema.pre(/^find/, function prequery(next: any) {
  // this points to the current query

  // can also select: false directly in the model properties to prevent showing it
  // void this.select('-password -passwordConfirm'); // this will prevent finding it to comparePassword

  // find only docs with active = true
  // in this case, revert it as previous users didn't have the default

  // eslint-disable-next-line no-void
  void this.find({ active: { $ne: false } });

  next();
});

userSchema.pre('aggregate', function preAgg(next: any) {
  next();
});

const User = mongoose.model<IUser>('User', userSchema);

export { User };
