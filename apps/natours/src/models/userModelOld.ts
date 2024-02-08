import mongoose from 'mongoose';
import isAscii from 'validator/lib/isAscii';
import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';

// import { pool as createPool } from 'workerpool';
import { SALT_WORK_FACTOR } from '../config';
import { encryptPassword } from '../helpers/crypto';
import { Logger } from '../loggers';
import { poolProxy } from '../workers';

// const pool = createPool();

// const worker1URL = new URL('../workers/worker1.js', import.meta.url);

// const workerPool1 = createPool(worker1URL.pathname.toString());

type IUser = Record<string, any>;

const userSchema = new mongoose.Schema<IUser>({
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
    validate: {
      validator: isURL,
      message: 'insert an url',
    },
  },
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
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // ! careful!!! only works on save/create
      validator: function validatePw(value: string) {
        // only works on document creation ( no update )
        const { password } = this as any;
        return password === value;
      },
      message: 'passwords must match',
    },
  },
  // // hide v from queries and returned documents
  // __v: {
  //     type: Number,
  //     select: false,
  // },
});

// virtual properties
// userSchema.virtual('durationWeeks').get(function getDurationWeeks() {
//     return this.duration / 7;
// });

// pre, post hooks (query, aggregate, document)

// ! USE A WORKER POOL FOR CRYPTO OPERATIONS
userSchema.pre('save', async function preHook(next: any) {
  try {
    // ! only hash if password has been modified or is new

    if (!this.isModified('password')) return next();

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
    if (process.env.WORKER_POOL_ENABLED === '1') {
      // working 1 with workerGet function but we can export the proxy directly as working 2
      // const pool = workerGet();
      // result = await pool.encryptPasswordWorker(
      //     this.password,
      //     SALT_WORK_FACTOR
      // );
      // working 2
      result = await poolProxy.encryptPasswordWorker(
        this.password,
        SALT_WORK_FACTOR
      );
      // working 3
      // const result2 = await pool1.exec('encryptPasswordWorker', [
      //     this.password,
      //     SALT_WORK_FACTOR,
      // ]);
      // working 4
      // const sayHello = (name: string) => {
      //     return console.log(`hi ${name}`);
      // };
      // pool1.exec(sayHello, ['mark']);

      // console.log(pool1.stats());
      // console.log(result2, 'result2');

      // test 1, doesn't work
      // result = await pool.exec(encryptPassword, [
      //     this.password,
      //     SALT_WORK_FACTOR,
      // ]);
    } else {
      // result = await Utilities.bcryptHash(password);
      result = await encryptPassword(this.password, SALT_WORK_FACTOR);
    }

    // console.log(result);

    // const result = await encryptPassword(this.password);

    this.password = result.hash;

    this.passwordConfirm = undefined;

    next();
  } catch (error) {
    Logger.error(error);
    return next(error);
  }
});

userSchema.pre(/^find/, function prequery(next: any) {
  // this.start = Date.now();
  // this will point at current query, not current document
  // filtering out the secretTour when a query is called
  // ! this doesn't work for findOne, specify for findOne to
  // eslint-disable-next-line no-void
  // void this.find({ secretTour: { $ne: true } }); // this chains the find
  // eslint-disable-next-line no-void
  // void this.select('-secretTour');
  // eslint-disable-next-line no-void

  next();
});

userSchema.pre('aggregate', function preAgg(next: any) {
  // this is the current aggregation object
  // this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const User = mongoose.model<IUser>('User', userSchema);

export { User };
