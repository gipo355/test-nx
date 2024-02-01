import 'dotenv-defaults/config';

import mongoose from 'mongoose';

import { App } from './app';
// import { importDevData } from './helpers/importDevData';
import { JSONLogger, Logger } from './loggers';

async function main() {
  Logger.info('########################### INIT MAIN');
  Logger.info(process.env.NODE_ENV);
  Logger.info(`Main ThreadPool size: ${process.env.UV_THREADPOOL_SIZE}`);

  const {
    NATOUR_MONGO_CONNECTION_STRING,
    NATOUR_MONGO_PASSWORD,
    PORT = 8000, // set default
    HOST = '127.0.0.1', // set default
  } = process.env;
  // Logger.debug(HOST);

  try {
    // mongoose
    const mongoAuthString = NATOUR_MONGO_CONNECTION_STRING?.replace(
      '<PASSWORD>',
      NATOUR_MONGO_PASSWORD!
    );

    // handle deprecation warning
    mongoose.set('strictQuery', false);
    // mongoose
    //     .connect(mongoAuthString as string, {
    //         // deal with deprecation warning
    //         // old api v5, on v6 not present
    //     })
    //     .then(() => Logger.info('DB connection established'))
    //     .catch((error) => Logger.error(error));

    // ! CONNECT TO DB
    // ! blocking code, must start connection to start listening
    // for unblocking, remove async and use then(), will continue if error
    await mongoose.connect(mongoAuthString!, {
      // deal with deprecation warning
      // old api v5, on v6 not present
    });
    Logger.info('DB connection established');

    // ! old block before refactoring for mvc
    // interface IUser {
    //     name: {
    //         type: StringConstructor;
    //         required: [boolean, string];
    //         unique: [boolean, string];
    //     };
    //     rating: {
    //         type: NumberConstructor;
    //         default: number;
    //     };
    //     price: {
    //         type: NumberConstructor;
    //         required: [boolean, string];
    //     };
    // }

    // // ! CREATE SCHEMA ( Document )
    // const tourSchema = new mongoose.Schema<IUser>({
    //     name: {
    //         type: String,
    //         required: [true, 'a tour must have a name'], // validator ( used to validate data )
    //         unique: [true, 'name must be unique'], // validator
    //     },
    //     rating: {
    //         type: Number,
    //         default: 4.5, // default value, will automatically be set if not specified
    //     },
    //     price: {
    //         type: Number,
    //         required: [true, 'a tour must have a price'], // error, message
    //     },
    // });

    // // ! CREATE MODEL ( collection ) on which the documents are created on
    // const Tour = mongoose.model<IUser>('Tour', tourSchema);

    // // ! CREATING DOC based on model which uses the schema defined
    // // const testTour = new Tour({
    // //     name: 'The Forest Hiker',
    // //     rating: 4.7,
    // //     price: 497,
    // // });
    // const testTour = new Tour({
    //     name: 'The Park Camper',
    //     price: 997,
    // });

    // // save to collection
    // const savedTour = await testTour.save(); // returns the inserted obj
    // Logger.info(`tour saved: ${savedTour}`);
  } catch (error) {
    JSONLogger.error(error);
    Logger.error(error);
  }

  // await importDevData();

  // ! listen
  App.listen(+PORT, HOST, () => {
    Logger.info(`app running and server listening @ ${HOST}:${PORT} ...`);
  });
}

await main();

// eslint-disable-next-line unicorn/prefer-top-level-await
