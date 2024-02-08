/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable no-console */
import 'dotenv-defaults/config';

import { readFile } from 'node:fs/promises';

import mongoose from 'mongoose';

// import simpleTourJson from '../../assets/dev-data/data/tours-simple.json';
import { Review, Tour, User } from '../src/models';

const { NATOUR_MONGO_CONNECTION_STRING, NATOUR_MONGO_PASSWORD } = process.env;
const mongoAuthString = NATOUR_MONGO_CONNECTION_STRING?.replace(
  '<PASSWORD>',
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  NATOUR_MONGO_PASSWORD!
);

(async function connectDB() {
  try {
    mongoose.set('strictQuery', false);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await mongoose.connect(mongoAuthString!, {});
    console.log('db connected');
  } catch (error) {
    console.log(error);
  }
})();

async function importDevData() {
  // eslint-disable-next-line no-useless-catch
  try {
    // read js file
    // const data = await readFile(simpleTourJson, 'utf8');
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const tours = await readFile(
      // eslint-disable-next-line unicorn/prefer-module
      `${__dirname}/../../assets/dev-data/data/tours.json`,
      // `${__dirname}/../../assets/dev-data/data/tours-simple.json`,
      'utf8'
    );
    const reviews = await readFile(
      // eslint-disable-next-line unicorn/prefer-module
      `${__dirname}/../../assets/dev-data/data/reviews.json`,
      // `${__dirname}/../../assets/dev-data/data/tours-simple.json`,
      'utf8'
    );
    const users = await readFile(
      // eslint-disable-next-line unicorn/prefer-module
      `${__dirname}/../../assets/dev-data/data/users.json`,
      // `${__dirname}/../../assets/dev-data/data/tours-simple.json`,
      'utf8'
    );

    // ! insert all data
    await Tour.create(JSON.parse(tours), { validateBeforeSave: false }); // MUST INSERT AN OBJECT
    await User.create(JSON.parse(users), { validateBeforeSave: false }); // MUST INSERT AN OBJECT
    await Review.create(JSON.parse(reviews), {
      validateBeforeSave: false,
    }); // MUST INSERT AN OBJECT
    // await Tour.insertMany(JSON.parse(simpleTourJson)); // MUST INSERT AN OBJECT
    // can also use create
    // await Tour.create(JSON.parse(data))

    // ! deletea all data
    // await Tour.deleteMany({});
    console.log('data inserted');
  } catch (error) {
    // console.log(error);
    throw error;
  }
}
async function deleteData() {
  // eslint-disable-next-line no-useless-catch
  try {
    // ! deletea all data
    await Tour.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    console.log('data deleted');
  } catch (error) {
    // console.log(error);
    throw error;
  }
}

const CLIArguments = process.argv.slice(2);
console.log(CLIArguments);

const possibleArguments = ['--delete', '--import'];

const hasConflictingArguments = possibleArguments.every((argument) =>
  CLIArguments.includes(argument)
);

if (hasConflictingArguments) {
  throw new Error(`can't import and delete at the same time`);
  // process.exit();
}

if (CLIArguments.includes('--import')) {
  importDevData()
    .then(() => {
      process.exit();
    })
    .catch((error) => {
      throw new Error(error);
    });
}
if (CLIArguments.includes('--delete')) {
  deleteData()
    .then(() => {
      process.exit();
    })
    .catch((error) => {
      throw new Error(error);
    });
}

// await importDevData();

// export { importDevData };
