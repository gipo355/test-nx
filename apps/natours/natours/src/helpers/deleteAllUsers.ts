/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable no-console */
import 'dotenv-defaults/config';

// import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';

// import simpleTourJson from '../../assets/dev-data/data/tours-simple.json';
import { User } from '../models';

const { NATOUR_MONGO_CONNECTION_STRING, NATOUR_MONGO_PASSWORD } = process.env;
const mongoAuthString = NATOUR_MONGO_CONNECTION_STRING?.replace(
  '<PASSWORD>',
  NATOUR_MONGO_PASSWORD!
);

(async function connectDB() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoAuthString!, {});
    console.log('db connected');
  } catch (error) {
    console.log(error);
  }
})();

async function deleteData() {
  // eslint-disable-next-line no-useless-catch
  try {
    // ! deletea all data
    await User.deleteMany({});
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
