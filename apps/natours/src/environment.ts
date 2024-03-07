import InfisicalClient from 'infisical-node';

import { Logger } from './loggers';

/**
 * ## Inject envs into process.env
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
  });

  /**
   * ## Getting all secrets from infisical
   * and populate process.env
   */
  await (async () => {
    await infisicalClient.getAllSecrets({
      environment: 'dev',
      path: '/',
      attachToProcessEnv: true,
      includeImports: false,
    });
    Logger.info(
      'infisicalClient initialized: secrets injected into process.env'
    );
  })();
};

interface SECRETS {
  NATOURS_STRIPE_TEST_PUBLIC: string | undefined;
  NATOURS_STRIPE_TEST_SECRET: string | undefined;
  NATOURS_STRIPE_ENDPOINT_SECRET: string | undefined;
  NATOURS_STRIPE_ENDPOINT_SECRET_PROD: string | undefined;
  NODE_ENV: string | undefined;
}

let SECRETS: SECRETS = {
  NATOURS_STRIPE_TEST_PUBLIC: '',
  NATOURS_STRIPE_TEST_SECRET: '',
  NATOURS_STRIPE_ENDPOINT_SECRET: '',
  NATOURS_STRIPE_ENDPOINT_SECRET_PROD: '',
  NODE_ENV: '',
};

initInfisical()
  .then(() => {
    /**
     * ## END INFISICAL
     */

    /**
     * ## Getting secrets from local ENV
     */
    // const { NATOUR_FROM_EMAIL } = process.env;

    // const { NATOURS_STRIPE_TEST_PUBLIC, NATOURS_STRIPE_TEST_SECRET } = process.env;
    SECRETS = {
      NATOURS_STRIPE_TEST_PUBLIC: process.env.NATOURS_STRIPE_TEST_PUBLIC,
      NATOURS_STRIPE_TEST_SECRET: process.env.NATOURS_STRIPE_TEST_SECRET,
      NATOURS_STRIPE_ENDPOINT_SECRET:
        process.env.NATOURS_STRIPE_ENDPOINT_SECRET,
      NATOURS_STRIPE_ENDPOINT_SECRET_PROD:
        process.env.NATOURS_STRIPE_ENDPOINT_SECRET_PROD,
      NODE_ENV: process.env.NODE_ENV,
      /**
       * ## MAKE ALL PROPS READYONLY
       */
    };
  })
  .catch((error) => Logger.error(error));

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
