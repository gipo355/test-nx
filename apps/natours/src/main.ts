import 'dotenv-defaults/config';

import cluster from 'node:cluster';

// test comment
// import { availableParallelism } from 'node:os';
import { IS_CLUSTER_ENABLED, maxClusters } from './config';
import { Logger } from './loggers';

Logger.info('starting app');
if (process.env.NODE_ENV === 'development') Logger.warn('development mode');

// import cluster from 'node:cluster';
// import { availableParallelism } from 'node:os';
// import process from 'node:process';

/**
 * ## MUST WRAP IN ASYNC FUNCTION
 * WOULD NOT AWAIT SINGLE LINES OTHERWISE
 * maybe because of top level await in entrypoint module?
 * maybe because i wasnt' using await import?
 * infisical injection wouldn't work without this
 * how does global error handling work with this?
 */
const main = async function main() {
  /**
   * ## Must come before everything else
   * variables needed
   * will overwrite .env dotfiles and other env variables
   * can actually use both
   */
  await import('./env');
  /**
   * ## the below doesnt work:
   * when importing withouth awaiting for execution of initinfisical, the code below it will execute
   */
  // const { initInfisical } = await import( './env')
  // await initInfisical();

  /* eslint-disable @typescript-eslint/no-misused-promises */
  /* eslint-disable import/first */
  /* eslint-disable unicorn/no-process-exit */
  /* eslint-disable no-console */
  /* eslint-disable no-process-exit */
  /* eslint-disable unicorn/no-null */
  const mongoose = await import('mongoose');

  const { UV_THREADPOOL_SIZE, WORKER_POOL_ENABLED } = await import('./config');

  process.env.UV_THREADPOOL_SIZE = `${UV_THREADPOOL_SIZE}`; // prefer use as ENV, not here ( but we can do cores - 1 if js )

  // import { closeMqWorker } from './messageBrokers/bullmqWorker';
  // import { emailPoolProxy } from './workers';

  // const closeBullmqWorker =
  //     WORKER_POOL_ENABLED === '1'
  //         ? async () => {
  //               await emailPoolProxy.closeMqWorkerInPool();
  //           }
  //         : async () => {
  //               await closeMqWorker();
  //           };
  // TODO: fix this
  const closeBullmqWorker = async () => {
    // let emailPoolProxy: any;
    // let closeMqWorker: any;
    if (WORKER_POOL_ENABLED === '1') {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      const { emailPoolProxy } = await import('./workers');
      return async () => {
        await emailPoolProxy.closeMqWorkerInPool();
      };
    }
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { closeMqWorker } = await import('./messageBrokers/bullmqWorker');
    return async () => {
      await closeMqWorker();
    };

    //     // eslint-disable-next-line node/no-unsupported-features/es-syntax
    //     // const { emailPoolProxy } = await import('./workers');
    // } else {
    //     // eslint-disable-next-line node/no-unsupported-features/es-syntax
    //     // const { closeMqWorker } = await import('./messageBrokers/bullmqWorker');
    // }
    // };
  };

  // import { emailWorker } from './messageBrokers';

  // ! ERROR HANDLING, CUSTOM IMPORTS ARE AFTER THE LISTENERS ( IMPORTING RUNS TOP LEVEL CODE WHICH MAY CONTAIN unhandled ERRORS we need to catch )
  // order is important

  // use mutable to allow closing server later
  let app: any;

  const gracefulShutdown = function gracefulShutdown() {
    app?.close(async () => {
      await closeBullmqWorker();
      await mongoose.disconnect();
      process.exit(1);
    });
  };

  // ! set listeners to catch unhandled errors

  /**
   * ## REDDIT PART
   */

  // ! handle closing ( stackoverflow reddit )
  process.stdin.resume(); // so the program will not close instantly

  /**
   * [TODO:description]
   *
   * @async
   * @param options - [TODO:description]
   * @param exitCode - [TODO:description]
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  function exitHandler(options: any, exitCode: any) {
    if (app)
      // app?.close(async () => {
      //     console.debug('HTTP server closed');
      //     // await emailWorker.close();
      //     // emailPoolProxy.closeEmailWorker();
      //     await closeBullmqWorker();
      //     await mongoose.disconnect();
      // });
      gracefulShutdown();
    console.log('########################## disconnected db and server');

    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
  }

  // do something when app is closing
  process.on('beforeExit', exitHandler.bind(null));
  process.on('exit', exitHandler.bind(null, { cleanup: true, exit: true })); // ! the EXIT LISTENER MUST COME BEFORE ANY PROCESS.EXIT CODE

  // catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

  // catches uncaught exceptions BAD, already done with jonas with soft exit
  // process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

  // ! graceful shutdown from express docs
  process.on('SIGTERM', () => {
    console.debug('SIGTERM signal received: closing HTTP server');
    // await emailWorker.close();
    // emailPoolProxy.closeEmailWorker();

    // await closeBullmqWorker();
    // await mongoose.disconnect();
    // app?.close(() => {
    //     console.debug('HTTP server closed');
    //     process.exit(1);
    // });
    gracefulShutdown();
  });

  /**
   * ## JONAS PART
   */
  // * HANDLING ASYNC UNHANDLED REJECTIONS
  // ! handling unhandled rejection events with graceful shutdown
  process.on('unhandledRejection', (err) => {
    console.error(err);
    console.log('unhandler rejection, shutting down...');
    // await emailWorker.close();
    // emailPoolProxy.closeEmailWorker();
    // await closeBullmqWorker();
    // await mongoose.disconnect();
    // app?.close(() => {
    //     process.exit(1);
    // });
    gracefulShutdown();
  });

  // * HANDLING SYNC UNHANDLED REJECTIONS
  // ! handling unhandled exceptions events with graceful shutdown
  // VERY BAD FROM EXPRESS DOCS - only if we don't crash the app
  // ! code moved to top - jonas says to put at top
  // process.on('uncaughtException', (err) => {
  //     console.error(err);
  //     console.log('uncaught exceptions, shutting down...');
  //     expServer?.close(async () => {
  //         await mongoose.disconnect();
  //         process.exit(1);
  //     });
  // });

  /**
   * ## SELF MODIFIED THE ORDER, THE LISTENERS MUST BE BEFORE THE EVENTS
   */

  // ! this code at the top, catches sync exceptions, must come before code execution
  process.on('uncaughtException', (err) => {
    console.error(err);
    console.log('uncaught exceptions, shutting down...');
    // process.exit(1);

    // app?.close(async () => {
    //     // await emailWorker.close();
    //     // emailPoolProxy.closeEmailWorker();
    //     await closeBullmqWorker();
    //     await mongoose.disconnect();
    //     process.exit(1);
    // });
    gracefulShutdown();
  });

  /**
   * ## MAIN ENTRYPOINT START
   */

  const { server } = await import('./server'); // this needs to come after the error listeners

  // * CODE AFTER ALL LISTENERS TO CATCH EVERYTHING, reassigned expserver to allow closing
  // ! removing async wrapper to allow closing the server
  // async function main() {
  app = await server();
  // }
};

/**
 * ## CLUSTERING
 * example of a clustered app with max 4 workers
 *
 * IMP: IT DOESN'T NEED PM2 INSTALLED THIS WAY
 */

if (!IS_CLUSTER_ENABLED) {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  main().catch((error) => {
    console.error(error);
  });
  // process.exit(1);
  // throw error;
}

if (IS_CLUSTER_ENABLED && maxClusters >= 1) {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let index = 0; index < maxClusters; index += 1) {
      cluster.fork();
    }
  } else {
    console.log(`Worker ${process.pid} started`);

    // eslint-disable-next-line unicorn/prefer-top-level-await
    main().catch((error) => {
      console.error(error);
    });
  }
}
if (IS_CLUSTER_ENABLED && maxClusters < 1) {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  main().catch((error) => {
    console.error(error);
  });
  // process.exit(1);
  // throw error;
}

/**
 * ## END CLUSTERING
 */

// await main();
// void main()
// NOTE: best implementation: catching all errors? but they need to be thrown up tho
//
// eslint-disable-next-line unicorn/prefer-top-level-await
// main().catch((error) => {
//     console.error(error);
// });
