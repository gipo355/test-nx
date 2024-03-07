import { ADDRGETNETWORKPARAMS } from 'node:dns';
import https from 'node:https';

import mongoose from 'mongoose';

import { createApp } from './app';
import { IS_HTTPS_ENABLED, WORKER_POOL_ENABLED } from './config';
import { cert, key } from './helpers';
import { Logger } from './loggers';

async function server() {
  // eslint-disable-next-line no-useless-catch
  try {
    Logger.info('########################### INIT MAIN');
    Logger.info(`NODE_ENV = ${process.env.NODE_ENV}`);
    Logger.info(`Main ThreadPool size: ${process.env.UV_THREADPOOL_SIZE}`);

    const {
      // WORKER_POOL_ENABLED = 0,
      NATOUR_MONGO_CONNECTION_STRING,
      NATOUR_MONGO_PASSWORD,
      NATOUR_PORT = 8000, // set default
      NATOUR_HOST = '127.0.0.1', // set default
    } = process.env;

    // mongoose
    if (!NATOUR_MONGO_CONNECTION_STRING && !NATOUR_MONGO_PASSWORD)
      throw new Error('invalid mongodb credentials');
    const mongoAuthString = NATOUR_MONGO_CONNECTION_STRING?.replace(
      '<PASSWORD>',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      NATOUR_MONGO_PASSWORD!
    );

    // handle deprecation warning
    mongoose.set('strictQuery', false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await mongoose.connect(mongoAuthString!, {});

    Logger.info('MongoDB connection established');

    /**
     * ## Init worker pools
     * here we handle the initialization of the worker pools if they are enabled
     * utils will have an auto function that will decide which function to use based on WORKER_POOL_ENABLED
     * some times on each function call will be checked if WORKER_POOL_ENABLED is enabled or not and use the appropriate function
     */
    if (WORKER_POOL_ENABLED === '1') {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      const { bullmqPoolInit, workerInit, imagePoolInit } = await import(
        './workers'
      );
      // const options = { minWorkers: 'max' };
      await workerInit();
      // Logger.info(pool1.stats());
      // init bullMq worker
      await bullmqPoolInit();

      await imagePoolInit();

      /**
       * ## CAREFULL, WE NEED TO BE SURE POOLPROXY HAS DONE THE ASYNC INITIALIZATION BEFORE USING POOLPROXY ( it's better to wrap everything )
       */

      // IMP: NON BLOCKING
      // void poolProxy.testFibonacci(48);
      // void poolProxy.testFibonacci(48);
      // void poolProxy.testFibonacci(48);
      // void poolProxy.testFibonacci(48);
      // IMP: BLOCKING CODE
      //
      // fibonacci function in a promise
      // const fibonacciPromise = async (number_: number) =>
      //     new Promise((resolve) => {
      //         const fib = (n: number): number => {
      //             if (n <= 2) return 1;
      //             return fib(n - 1) + fib(n - 2);
      //         };
      //         const result = fib(number_);
      //         resolve(result);
      //     });
      // fibonacciPromise(45).then((data) => console.log(data));
    } else {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      const { bullmqWorkerInit } = await import('./messageBrokers');

      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      bullmqWorkerInit();
    }

    const App = await createApp();

    // ! listen
    // returning this to be able to close in tests with (close())
    if (IS_HTTPS_ENABLED && key && cert) {
      Logger.info('HTTPS enabled for development');
      return https
        .createServer({ key, cert }, App)
        .listen(Number(NATOUR_PORT), NATOUR_HOST, () => {
          Logger.info(
            `app running and server listening @ https://${NATOUR_HOST}:${NATOUR_PORT} ...`
          );
          if (process.send) process.send('ready'); // send ready to pm2
        });
    }
    Logger.info('HTTPS disabled');
    return App.listen(Number(NATOUR_PORT), NATOUR_HOST, () => {
      Logger.info(
        `app running and server listening @ http://${NATOUR_HOST}:${NATOUR_PORT} ...`
      );
      if (process.send) process.send('ready'); // send ready to pm2
    });
  } catch (error) {
    // moved to catch everything
    // Logger.error(error);
    Logger.error(error);
    throw error; // to pass it to main and it's catchers
  }
}
export { server };
