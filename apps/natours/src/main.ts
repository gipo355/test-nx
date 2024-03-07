import 'dotenv-defaults/config';

import mongoose from 'mongoose';

import { Logger } from './loggers';

Logger.info('starting app');
Logger.info(`mode: ${process.env.NODE_ENV}`);

function exitHandler(
  options: { cleanup?: boolean; exit: boolean },
  exitCode: number
) {
  Logger.info('########################## disconnected db and server');

  if (options.cleanup) Logger.info('clean');
  if (exitCode || exitCode === 0) Logger.info(exitCode);
  throw new Error('exit received, shuttind down...');
}

const closeBullmqWorker = async () => {
  const { emailPoolProxy } = await import('./workers/workerPools.js');
  return async () => {
    await emailPoolProxy.closeMqWorkerInPool();
  };
};

const main = async function main() {
  /**
   * ## Must come before everything else to load env vars
   */
  await import('./environment.js');

  /**
   * ## Handlers
   */

  process.stdin.resume(); // so the program will not close instantly

  process.on('beforeExit', exitHandler.bind(null));
  process.on('exit', exitHandler.bind(null, { cleanup: true, exit: true })); // ! the EXIT LISTENER MUST COME BEFORE ANY PROCESS.EXIT CODE

  process.on('SIGINT', exitHandler.bind(null, { exit: true }));

  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

  process.on('SIGTERM', () => {
    Logger.info('SIGTERM signal received: closing HTTP server');
    throw new Error('SIGTERM signal received: closing HTTP server');
  });

  process.on('unhandledRejection', (err) => {
    Logger.error(err);
    throw new Error('unhandled rejection, shutting down...');
  });

  process.on('uncaughtException', (err) => {
    Logger.error(err);
    throw new Error('uncaught exception, shutting down...');
  });

  /**
   * ## MAIN ENTRYPOINT START
   */

  const { server } = await import('./server.js');

  const app = await server();

  app.on('clientError', () => {
    app.close(async () => {
      await closeBullmqWorker();
      await mongoose.disconnect();
    });
  });
  app.on('error', () => {
    app.close(async () => {
      await closeBullmqWorker();
      await mongoose.disconnect();
    });
  });
  app.on('close', () => {
    app.close(async () => {
      await closeBullmqWorker();
      await mongoose.disconnect();
    });
  });
};

main().catch((error) => {
  Logger.error(JSON.stringify(error, null, 2));
});
