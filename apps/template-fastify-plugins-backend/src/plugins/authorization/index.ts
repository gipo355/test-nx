/* eslint-disable unicorn/no-null */

import cookieParser from '@fastify/cookie';
import csrf from '@fastify/csrf-protection'; // type FastifyCsrfProtectionOptions,
import { fastifyOauth2, type OAuth2Namespace } from '@fastify/oauth2';
import fastifySession from '@fastify/session';
import RedisStore from 'connect-redis';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Redis } from 'ioredis';

import { authenticate } from './authenticate.js';
import { getOauth2UserInfoFromAccessToken } from './getOauth2Info.js';
import { oauth2SignupHandler } from './oauth2SignupHandler.js';
import { removeAllUserSessions } from './removeAllUserSessions.js';
import { restrictTo } from './restrictTo.js';

const plugin: FastifyPluginAsync = async (fastify) => {
  const { env, log, config } = fastify;

  const redisAuthConnection = new Redis(env.REDIS_URL);

  fastify.decorate('redisAuthConnection', redisAuthConnection);

  fastify.addHook('onClose', async () => {
    await redisAuthConnection.quit();
  });

  /**
   * ## utilities to combine multiple auth strategies in a single hook
   * allows use to combine authenticate and restrictTo with and or or
   */
  await fastify.register(import('@fastify/auth'));

  /**
   * ## Must come BEFORE oauth2 plugin
   */
  await fastify.register(cookieParser, {
    secret: env.COOKIE_SECRET,
    // ...
  });

  /**
   * ## `fastify-oauth2` is a plugin that helps you handle oauth2 flows.
   * alternatives are lucia, passport, simple-oauth2, authjs
   * It comes with preconfigured settings for the major oauth providers.
   * Are you using Auth0? See https://npm.im/fastify-auth0-verify
   */
  await fastify.register(fastifyOauth2, {
    name: 'githubOAuth2',
    credentials: {
      client: {
        id: env.GITHUB_APP_ID,
        secret: env.GITHUB_APP_SECRET,
      },
      auth: fastifyOauth2.GITHUB_CONFIGURATION,
    },
    startRedirectPath: '/auth/github',
    // TODO: this url should change if we are in prod
    // callbackUri: 'http://localhost:3000/auth/github/callback',
    callbackUri: config.GITHUB_CALLBACK_URI,
    // callbackUriParams: {
    //     access_type: 'offline', // send refresh_token too
    // },
    scope: ['user:email'],
  });
  await fastify.register(fastifyOauth2, {
    name: 'googleOAuth2',
    credentials: {
      client: {
        id: env.GOOGLE_APP_ID,
        secret: env.GOOGLE_APP_SECRET,
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/auth/google',
    // TODO: this url should change if we are in prod
    callbackUri: config.GOOGLE_CALLBACK_URI,
    // callbackUriParams: {
    //     access_type: 'offline', // send refresh_token too
    // },
    scope: ['profile', 'email'],
  });

  /**
   * ## CSRF protection, OPTIONS OVERRIDE COOKIE OPTIONS
   * methods reply.generateCsrf()
   */
  await fastify.register(csrf, {
    sessionPlugin: '@fastify/cookie', // '@fastify/session', @fastify/session-secure' or '@fastify/cookie'
    cookieOpts: config.CSRF_COOKIE_OPTIONS,
    csrfOpts: {
      hmacKey: env.CSRF_SECRET,
    },
    // getToken: (req) => req.headers['csrf-token'],
  });

  /**
   * Fastify-session ( with connect-redis )
   * is an alternative to using jwt for authentication.
   * doesn't mean we mustn't use jwt. jwt is used for secure messaging mainly
   * for stateless tokens (tokens with data in it. fastify-secure-session is the same).
   * the session token is equivalent to the jwt refresh token.
   * NOTE: fastify-session automatically sets a cookie
   */
  const redisStore = new RedisStore({
    client: redisAuthConnection,
    prefix: 'session:',
  });

  await fastify.register(fastifySession, {
    secret: env.SESSION_SECRET,
    cookie: config.SESSION_COOKIE_OPTIONS,
    store: redisStore,
    saveUninitialized: false, // don't save empty sessions
    rolling: true,
  });

  /**
   * ## Custom Decorators
   */

  // fastify session automatically refreshes expiration with rolling opt
  // we don't need this, it was created for fastify-jwt but refreshing is easy
  // with sessions
  // fastify.decorate('refreshTokens', refreshTokens);

  // will check that user has a valid session in the store
  fastify.decorate('authenticate', authenticate);

  // after authentication, this decorator will check if the user is allowed
  // using the session store info which contains the role
  fastify.decorate('restrictTo', restrictTo);

  // Decorator to get user info from oauth2 access token after a successful
  // callback from the oauth2 provider
  fastify.decorate('getOauth2EmailFromToken', getOauth2UserInfoFromAccessToken);

  // Decorator to handle oauth2 signup in both callbacks
  fastify.decorate('oauth2SignupHandler', oauth2SignupHandler);

  // add request decorator to remove all user sessions
  fastify.decorateRequest('removeAllUserSessions', null);
  fastify.addHook('onRequest', (request, _, done) => {
    request.removeAllUserSessions = removeAllUserSessions(fastify, request);
    done();
  });
  log.info('🔐 Authorization registered');
};

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: typeof authenticate;
    githubOAuth2: OAuth2Namespace;
    googleOAuth2: OAuth2Namespace;
    getOauth2EmailFromToken: typeof getOauth2UserInfoFromAccessToken;
    restrictTo: typeof restrictTo;
    oauth2SignupHandler: typeof oauth2SignupHandler;
    redisAuthConnection: Redis;
  }
  interface FastifyRequest {
    csrfToken: string | undefined;
    removeAllUserSessions: ReturnType<typeof removeAllUserSessions>;
  }
  // for fastify-session, add custom properties to the session
  // session payload is a global custom type
  interface Session extends SessionPayload {}
}

const authorization = fp(plugin, {
  name: 'authorization',
  // psql is needed
  dependencies: ['config', 'environment', 'psql'],
});

export default authorization;
