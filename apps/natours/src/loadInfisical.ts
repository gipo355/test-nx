import 'dotenv-defaults/config';

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
  await infisicalClient.getAllSecrets({
    environment: 'dev',
    path: '/',
    attachToProcessEnv: true,
    includeImports: false,
  });

  Logger.info('infisicalClient initialized: secrets injected into process.env');
};
export { initInfisical };
