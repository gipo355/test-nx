import mongoose from 'mongoose';

import { createApp } from './app';
import { SECRETS } from './environment.js';
import { Logger } from './loggers';
import {
  bullmqPoolInit,
  imagePoolInit,
  workerPoolInit,
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

  const mongoAuthString = NATOUR_MONGO_CONNECTION_STRING.replace(
    '<PASSWORD>',
    NATOUR_MONGO_PASSWORD
  );

  // handle deprecation warning
  mongoose.set('strictQuery', false);

  await mongoose.connect(mongoAuthString, {});

  Logger.info('MongoDB connection established');

  Logger.info('🔥 initializing worker pools...');

  // TODO: fix pools to create types, refactor folders
  await workerPoolInit();
  await bullmqPoolInit();
  await imagePoolInit();

  Logger.info('🔥 creating express app...');

  const App = await createApp();

  Logger.info('🚀 starting server...');

  return App.listen(Number(NATOUR_PORT), NATOUR_HOST, () => {
    Logger.info(
      `✅ app running and server listening @ ${NATOUR_HOST}:${NATOUR_PORT} ...`
    );
    if (process.send) process.send('ready'); // send ready to pm2
  });
}
export { createServer };
