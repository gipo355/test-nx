/* eslint-disable unicorn/prevent-abbreviations */
import InfisicalClient from 'infisical-node';

import { Logger } from './loggers';

// import { Logger } from './loggers';

// TODO: transition to npm infisical-node package

/**
 * ## START INFISICAL
 */
const initInfisical = async () => {
  const { INFISICAL_TOKEN } = process.env;

  if (!INFISICAL_TOKEN) {
    Logger.error(
      'INFISICAL_TOKEN env variable not found, using normal envs and dotfiles'
    );
    return;
  }
  /**
   * ## Creating infisical client
   */
  const infisicalClient = new InfisicalClient({
    token: INFISICAL_TOKEN,
    // cacheTTL: 300 // default 5 mins
  });

  /**
   * IMP: for this project i will use process.env injection as it's massively built up around
   * env variables. for other projects, i will use the getSecret() method
   *
   * ## Getting all secrets from infisical
   * Retrieve all secrets within a given environment and folder path. The service token used must have access to the given path and environment.
   */
  await (async () => {
    await infisicalClient.getAllSecrets({
      environment: 'dev',
      // path: '/foo/bar/',
      attachToProcessEnv: true, // (boolean, optional): Whether or not to attach fetched secrets to process.env. If not specified, the default value is false.
      // includeImports: false, // (boolean, optional): Whether or not to include imported secrets from the current path.
    });
    Logger.info(
      'infisicalClient initialized: secrets injected into process.env'
    );
  })();
};
await initInfisical();

/**
 * ## END INFISICAL
 */

/**
 * ## Getting secrets from local ENV
 */
// const { NATOUR_FROM_EMAIL } = process.env;

// const { NATOURS_STRIPE_TEST_PUBLIC, NATOURS_STRIPE_TEST_SECRET } = process.env;
const SECRETS = {
  NATOURS_STRIPE_TEST_PUBLIC: process.env.NATOURS_STRIPE_TEST_PUBLIC,
  NATOURS_STRIPE_TEST_SECRET: process.env.NATOURS_STRIPE_TEST_SECRET,
  NATOURS_STRIPE_ENDPOINT_SECRET: process.env.NATOURS_STRIPE_ENDPOINT_SECRET,
  NATOURS_STRIPE_ENDPOINT_SECRET_PROD:
    process.env.NATOURS_STRIPE_ENDPOINT_SECRET_PROD,
  NODE_ENV: process.env.NODE_ENV,
  /**
   * ## MAKE ALL PROPS READYONLY
   */
} as const;

/**
 * ## Manually injecting secrets into process.env
 */

for (const [key, variable] of Object.entries(SECRETS))
  if (
    !variable
    // variable !== 0
  ) {
    Logger.error(`Missing required environment variable: ${key}`);
  }

export { SECRETS };
