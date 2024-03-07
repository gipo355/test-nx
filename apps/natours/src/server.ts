import mongoose from 'mongoose';

import { createApp } from './app';
import { SECRETS } from './environment.js';
import { Logger } from './loggers';
import {
  bullmqPoolInit,
  imagePoolInit,
  workerInit,
} from './workers/workerPools.js';

async function createServer() {
  Logger.info('🤯 creating server...');

  Logger.info(`🍀 NODE_ENV = ${process.env.NODE_ENV}`);
  Logger.info(`🍀 Main ThreadPool size: ${process.env.UV_THREADPOOL_SIZE}`);

  Logger.info('🔥 connecting to mongoose...');
  const {
    NATOUR_MONGO_CONNECTION_STRING,
    NATOUR_MONGO_PASSWORD,
    NATOUR_PORT = 8000,
    NATOUR_HOST = '127.0.0.1',
  } = SECRETS;

  // mongoose
  const mongoAuthString = NATOUR_MONGO_CONNECTION_STRING.replace(
    '<PASSWORD>',
    NATOUR_MONGO_PASSWORD
  );

  // handle deprecation warning
  mongoose.set('strictQuery', false);

  await mongoose.connect(mongoAuthString, {});

  Logger.info('MongoDB connection established');

  /**
   * ## Init worker pools
   */
  Logger.info('🔥 initializing worker pools...');

  await workerInit();
  await bullmqPoolInit();
  await imagePoolInit();

  const App = await createApp();

  return App.listen(Number(NATOUR_PORT), NATOUR_HOST, () => {
    Logger.info(
      `app running and server listening @ http://${NATOUR_HOST}:${NATOUR_PORT} ...`
    );
    if (process.send) process.send('ready'); // send ready to pm2
  });
}
export { createServer };
