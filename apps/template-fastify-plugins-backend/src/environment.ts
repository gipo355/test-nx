import { isMainThread } from 'node:worker_threads';

import Env from '@fastify/env';
import { type Static, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import InfisicalClientClass from 'infisical-node';

/**
 * ## Define here the infisical client options
 * Infisical will try to load environment variables from the path specified into
 * process.env IF env INFISICAL_TOKEN is defined
 * this will happend before checking for the variables in the schema
 */
const infisicalClientOptions = {
  environment: 'dev',
  path: '/fastify',
  attachToProcessEnv: true,
};

/**
 * ## Environment
 * set the environment variables needed
 * these will be validated and added to fastify.env
 */
const variablesSchema = Type.Object({
  UV_THREADPOOL_SIZE: Type.Optional(Type.String()),
  MONGO_URL: Type.String({}),
  PSQL_URL: Type.String({}),
  REDIS_URL: Type.String({}),
  NODE_ENV: Type.Union([
    Type.Literal('development'),
    Type.Literal('production'),
    Type.Literal('test'),
  ]),
  PORT: Type.String({}),

  CSRF_SECRET: Type.String(),
  JWT_SECRET: Type.String(),
  COOKIE_SECRET: Type.String(),
  SESSION_SECRET: Type.String(),

  GITHUB_APP_ID: Type.String(),
  GITHUB_APP_SECRET: Type.String(),
  GOOGLE_APP_ID: Type.String(),
  GOOGLE_APP_SECRET: Type.String(),

  SENTRY_DSN: Type.String(),

  /**
   * ## Mail
   */
  MAILTRAP_HOST: Type.String(),
  MAILTRAP_PORT: Type.String(),
  MAILTRAP_USERNAME: Type.String(),
  MAILTRAP_API_TOKEN_OR_PASSWORD: Type.String(),
  MAILTRAP_FROM: Type.String(),
});

const initInfisical = async (fastify: FastifyInstance) => {
  const { log } = fastify;
  const { INFISICAL_TOKEN } = process.env;

  if (
    INFISICAL_TOKEN === '' ||
    INFISICAL_TOKEN === undefined ||
    !INFISICAL_TOKEN
  ) {
    log.warn(
      `INFISICAL_TOKEN is not defined. Skipping InfisicalClient initialization.`
    );
    return;
  }

  // TODO: check if the bug is fixed upstream
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const InfisicalClient = new (InfisicalClientClass as any)({
    token: INFISICAL_TOKEN,
    // cacheTTL: 300 // default 5 mins
  });

  await (async () => {
    await InfisicalClient.getAllSecrets(infisicalClientOptions);
  })();
};

const plugin: FastifyPluginAsync = async (instance) => {
  await initInfisical(instance);

  await instance.register(Env, {
    dotenv: true,
    confKey: 'env',
    schema: variablesSchema,
  });

  Value.Check(variablesSchema, instance.env);

  instance.log.info(
    `environment plugin initialized. Thread: ${
      isMainThread ? 'MAIN' : 'WORKER'
    }`
  );

  instance.log.info(`🌱 environment plugin initialized.`);
};

declare module 'fastify' {
  export interface FastifyInstance {
    // env: typeof SECRETS;
    env: Static<typeof variablesSchema>;
  }
}

const environment: FastifyPluginAsync = fp(plugin, {
  name: 'environment',
});

export default environment;
