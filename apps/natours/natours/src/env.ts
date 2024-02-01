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

  // console.log(secrets);

  /**
   * ## Getting individual secrets from infisical
   *
   * By default, getSecret() fetches and returns a personal secret. If not found, it returns a shared secret, or tries to retrieve the value from process.env. If a secret is fetched, getSecret() caches it to reduce excessive calls and re-fetches periodically based on the cacheTTL option (default is 300 seconds) when initializing the client — for more information, see the caching section.
   */

  // const NATOUR_MONGO_USERNAME = await client.getSecret('NATOUR_MONGO_USERNAME');
  // process.env.NATOUR_MONGO_USERNAME = NATOUR_MONGO_USERNAME.secretValue; // set it as an env variable
  // const value = NATOUR_MONGO_USERNAME.secretValue; // get its value
  // process.env.NATOUR_MONGO_USERNAME = value; // set it as an env variable

  // const { secretValue: NATOURS_STRIPE_TEST_PUBLIC } =
  //     await infisicalClient.getSecret('NATOURS_STRIPE_TEST_PUBLIC', {
  //         environment: 'dev',
  //         // path: '/',
  //         // type: 'shared',
  //     });
  // const { secretValue: NATOURS_STRIPE_TEST_SECRET } =
  //     await infisicalClient.getSecret('NATOURS_STRIPE_TEST_SECRET', {
  //         environment: 'dev',
  //         // path: '/',
  //         // type: 'shared',
  //     });
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

// if (!NATOURS_STRIPE_TEST_PUBLIC || !NATOURS_STRIPE_TEST_SECRET)
//     Logger.error(
//         'Missing required environment variable: NATOURS_STRIPE_TEST_PUBLIC or NATOURS_STRIPE_TEST_SECRET'
//     );

/**
 * ## Manually injecting secrets into process.env
 */

/**
 * ## validations
 */
// const varsOBJ = {
//     // NATOUR_FROM_EMAIL,
//     // NATOUR_MONGO_USERNAME,
//     // NATOUR_MONGO_PASSWORD,
//     NATOURS_STRIPE_TEST_PUBLIC,
//     NATOURS_STRIPE_TEST_SECRET,
// };

/**
 * ## we need to be aware of possible 0 in values, can't use falsy check.
 */
// if (variable === undefined || variable === null || variable === '') {
// eslint-disable-next-line no-restricted-syntax
// for (const [key, variable] of Object.entries(varsOBJ))
//     if (
//         // variable !== 0 &&
//         !variable
//     ) {
//         Logger.error(`Missing required environment variable: ${key}`);
//     }
// eslint-disable-next-line no-restricted-syntax
for (const [key, variable] of Object.entries(SECRETS))
  if (
    !variable
    // variable !== 0
  ) {
    Logger.error(`Missing required environment variable: ${key}`);
  }

// console.log('infisicalClient', infisicalClient);

// Logger.info('Infisical client initialized: all secrets injected');

// return infisicalClient;

// const infisicalClient = await initInfisical();

export {
  // infisicalClient,
  // NATOURS_STRIPE_TEST_PUBLIC,
  // NATOURS_STRIPE_TEST_SECRET,
  SECRETS,
};
