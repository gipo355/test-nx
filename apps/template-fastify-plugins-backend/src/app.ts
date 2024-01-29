import path from 'node:path';
import { fileURLToPath } from 'node:url';

import AutoLoad from '@fastify/autoload';
import type { FastifyPluginAsync } from 'fastify';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

console.log('ok');

// Any option specified here will override plugin.autoConfig options specified in the plugin itself.
// When setting both options.prefix and plugin.autoPrefix they will be concatenated.
// Place your custom options for app below here to pass to all plugins
// export type AutoloadAppOptions = {
// ...
// } & Partial<AutoloadPluginOptions>;
// Pass --options via CLI arguments in command to enable these options.
// const autoloadAppOptions: AutoloadAppOptions = {};
// NOTE: we are using autoload in subfolders too, so we would need a way
// to pass options to autoload in subfolders

const app: FastifyPluginAsync = async function app(
  instance
  // options_
): Promise<void> {
  /**
   * ## Load global environment under `fastify.env`
   */
  await instance.register(import('./environment.js'));
  /**
   * ## Load global config under `fastify.config`
   */
  await instance.register(import('./config.js'));

  /**
   * ## Autoload all global plugins
   */
  await instance.register(AutoLoad, {
    dirNameRoutePrefix: false,
    forceESM: true,
    dir: path.join(dirname, 'plugins'),
    // options: { ...autoloadAppOptions },
    // Include only index.js files, allowing more room for customization
    ignoreFilter: (filePath) => !filePath.endsWith('index.js'),
  });

  /**
   * ## Routes
   * I WILL MANUALLY REGISTER ROTUES.
   * AUTOLOAD IS TOO SIMPLE FOR SOME COMPLES USE CASES (like nested routes, or
   * separated shared hooks)
   * use autoload in subfolders instead
   */
  await instance.register(import('./routes/index.js'));

  /**
   * ## Lifecycle hooks
   * AFTER TRIGGERS AFTER ALL THE ROUTES ARE REGISTERED
   */
  instance.after(() => {
    instance.log.info('(after) Routes registered');
  });

  instance.ready((err) => {
    if (err instanceof Error) throw err;

    instance.swagger();

    const info = {
      UV_THREADPOOL_SIZE: instance.env.UV_THREADPOOL_SIZE,
      NODE_ENV: instance.env.NODE_ENV,
      PORT: instance.env.PORT,
    };

    // instance.log.debug('debug log test'); // TODO: debug and trace levels don't work with custom pino

    if (instance.env.NODE_ENV === 'development') {
      instance.log.info(`Routes map: \n${instance.printRoutes()}`);
      // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    instance.log.info(`👌 App is ready!`);

    instance.log.info(info);
  });
};

export default app;
