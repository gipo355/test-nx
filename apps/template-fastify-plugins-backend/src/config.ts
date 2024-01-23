import type { CookieSerializeOptions } from '@fastify/cookie';
import type { CookieOptions } from '@fastify/session';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const generateConfig = (fastifyInstance: FastifyInstance) => {
  const { env } = fastifyInstance;

  const CSRF_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7 days
  const CSRF_COOKIE_OPTIONS: CookieSerializeOptions = {
    signed: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: CSRF_TOKEN_EXPIRATION,
    // domain: 'example.com',
    path: '/',
    secure: env.NODE_ENV === 'production',
    expires: new Date(Date.now() + CSRF_TOKEN_EXPIRATION),
  };

  const SESSION_COOKIE_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7 days
  const SESSION_COOKIE_OPTIONS: CookieOptions = {
    // TODO: put domains into env
    // domain: 'example.com',
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_COOKIE_EXPIRATION,
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + SESSION_COOKIE_EXPIRATION),
  };

  const config = {
    /**
     * ## Add here all global config to make it available to every fastify
     * instance under `fastify.config`
     * must come after environment plugin
     */

    /**
     * ## Worker Pool
     */
    WORKER_POOL_ENABLED: true, // '1' or undefined
    POOL_MIN_WORKERS: undefined, // max sets min to n of max workers ( cores - 1 is the default max if undefined)
    POOL_MAX_WORKERS: 4, // default is cores - 1 if undefined

    /**
     * ## Databases
     */
    MONGO_ENABLED: true,
    ELASTIC_ENABLED: false,
    REDIS_ENABLED: true,
    PSQL_ENABLED: true,

    /**
     * ## Swagger UI
     */
    SWAGGER_UI_ENABLED: fastifyInstance.env.NODE_ENV !== 'production',

    /**
     * ## Email Verification
     */
    NEW_USER_EMAIL_EXPIRATION: 1000 * 60 * 10, // 10 minutes

    /**
     * ## AUTH
     */
    REFRESH_TOKEN_EXPIRATION: 1000 * 60 * 60 * 24 * 7, // 7 days
    ACCESS_TOKEN_EXPIRATION: 1000 * 60 * 2, // 2 minutes
    CSRF_TOKEN_EXPIRATION,
    SESSION_COOKIE_EXPIRATION,
    SESSION_COOKIE_OPTIONS,
    // TODO: put those into env
    // GITHUB_CALLBACK_URI: 'https://api.example.com:5001/auth/github/callback',
    // GOOGLE_CALLBACK_URI: 'http://localhost:3000/auth/google/callback',
    GITHUB_CALLBACK_URI: 'http://localhost:3000/auth/github/callback',
    GOOGLE_CALLBACK_URI: 'http://localhost:3000/auth/google/callback',

    CSRF_COOKIE_OPTIONS,

    // redis prefixes
    SESSION_KEY_PREFIX: 'session',
    SESSION_SET_PREFIX: 'user-sessions',

    /**
     * ## Security
     */
    CORS_OPTIONS: {
      origin: 'http://localhost:5173',
      // origin: false, // disable cors
      // origin: ['https://gipo.dev', /\.gipo\.dev/],
      // origin: [
      //     'http://127.0.0.1',
      //     /\.127.0.0.1/,
      //     'https://example.com',
      //     /\.example.com/,
      // ],
      // origin: true,
      // origin: '*.example.com',
      // origin: ['*.gipo.dev'],
      // origin: new RegExp(/http:\/\/localhost/),
      // methods: ['GET', 'POST', 'DELETE', 'PATCH'],
      // allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      // cacheControl: true,
      // preflightContinue: true,
      // preflight: true,
      // hideOptionsRoute: true,
      // optionsSuccessStatus: 200,
    },
    HELMET_OPTIONS: {
      // Example disables the `contentSecurityPolicy` middleware but keeps the rest.
      // contentSecurityPolicy: {
      //     directives: {
      //         // defaultSrc: ["'self'"],
      //         scriptSrc: [
      //             "'self'",
      //             // "'unsafe-inline'",
      //             // "'unsafe-eval'",
      //         ],
      //     },
      // },
    },
  };

  return config;
};

const plugin: FastifyPluginAsync = async (instance) => {
  instance.decorate('config', generateConfig(instance));

  instance.log.info('🧰 Config plugin registered');
};

declare module 'fastify' {
  export interface FastifyInstance {
    config: ReturnType<typeof generateConfig>;
  }
}

const config: FastifyPluginAsync = fp(plugin, {
  name: 'config',
  dependencies: ['environment'],
});

export default config;
