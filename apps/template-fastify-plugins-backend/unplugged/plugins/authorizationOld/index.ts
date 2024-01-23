/* eslint-disable unicorn/no-null */

import cookieParser from '@fastify/cookie';
import csrf from '@fastify/csrf-protection'; // type FastifyCsrfProtectionOptions,
import jwt from '@fastify/jwt';
import { fastifyOauth2, type OAuth2Namespace } from '@fastify/oauth2';
// import fastifySession from '@fastify/session';
// import RedisStore from 'connect-redis';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Redis } from 'ioredis';

import type { TAccessTokenPayload } from '../schemas/schemas.js';
import { authenticate } from './authenticate.js';
import { createSetJwtCookieToken } from './createSetJwtCookieToken.js';
// import { isUserAllowed } from './isUserAllowed.js';
import { getOauth2UserInfoFromAccessToken } from './getOauth2Info.js';
import { oauth2SignupHandler } from './oauth2SignupHandler.js';
import { refreshTokens } from './refreshTokens.js';
import { restrictTo } from './restrictTo.js';

/**
 * ## Authorization
 * there are many different ways to implement auth
 * can use local auth, oauth2.
 * for storing info we use cookies or Authorization header or body: jwt, sessions and redis
 * only over https
 *
 * a secure algo is libsodium (fastify-secure-session and paseto use it)
 * - for sessions we have: Lucia, fastify-session, fastify-secure-session, auth.js
 * - for tokens we can use fastify-jwt, jose, or PASETO
 * - we could also use passport.js or better fastify-passport (which uses fastify-session
 * or fastify-secure-session)
 * - or a 3d party service like clerk
 *
 * everyone recommends sessions for auth
 * JWT is for sending trusted messages
 * both can coexist
 *
 * stateless tokens (jwt, secure-session) store the user info in the token
 * stateful sessions (fastify-session, lucia, authjs) store the user info in the session store
 *
 * stateless tokens need access-refresh token pair.
 * the refresh acts like a session and is checked against the db
 * it's better for scalability if instead we use a blacklist instead of a whitelist
 * (clusters may receive updated whitelist late)
 *
 * the session id will store the user and the role in redis
 *
 * NOTE: important mentions
 *
 * on privilege update or important changes, the user must be logged out everywhere
 * on password change, the user must be logged out everywhere
 * don't accept non existing sessions
 * fixate the session with User-agent and IP, invalidating the session if they change
 *
 * IP and user-agent must be proxied to fastify (and cookies, headers too if behind 1)
 * on caddy, X-Forwarder-For
 * for IP, either X-Forwarder-For or [req.ip, req.raw.ip] or sveltekit event.clientAddress
 * for user-agent, req.headers['user-agent'] or sveltekit event.headers['user-agent']
 *
 * token should be encrypted(to prevent reading extra data) and signed (to prevent tampering)
 * [https://www.reddit.com/r/webdev/comments/6dyzbn/is_a_sessionbased_or_tokenbased_stateless/]
 * the session ID must be random and unguessable, have high entropy
 * if encrypted, the algo must be secure
 * on login and logout, clear all expired from db
 * on logout all all sessions must be invalidated
 * notify user on login from new device
 * refresh the session after x invalidating the old one (2 expiry types, short and long + idle)
 *
 *
 * in this case, we will auth users with oauth2 which will confirm the email
 * without the need to use passwords
 * and store the session in cookies and redis
 * sessions must be checked against the db on every request but can be
 * revoked instantly and are battle tested
 *
 * encryption and signing are heavy processes, so we will use a worker thread
 * to handle them
 *
 * as methods, we will have 1 authenticate middleware hook that will check
 * onRequest if user is authenticated and provide the info (id, role)
 * and a authorize(role) hook that will check if the user is allowed with the info
 */

const plugin: FastifyPluginAsync = async (fastify) => {
  const { env, log, config } = fastify;

  const redisAuthConnection = new Redis(env.REDIS_URL);

  fastify.decorate('redisAuthConnection', redisAuthConnection);

  fastify.addHook('onClose', async () => {
    await redisAuthConnection.quit();
  });

  // Redis store for fastify-session
  // const redisStore = new RedisStore({
  //     client: redisAuthConnection,
  //     prefix: 'myapp:',
  // });

  // utilities to combine multiple auth strategies
  await fastify.register(import('@fastify/auth'));

  /**
   * ## JWT
   * adds fastify.sign({payload}) and req.jwtVerify() to route handlers
   * decorate all reqs with req.authenticate() to protect routes
   * check notes for good implementation at https://github.com/fastify/fastify-jwt
   *  TODO: move jwt to worker thread?
   *  TODO: encrypt jwe?
   */
  void fastify.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'refresh_token',
      signed: false, // jwt is already tamper proof
    },
    // cache will cache the token, huge speed boost
    verify: {
      cache: true,
    },
    // sign: {
    //     expiresIn: '10m',
    // },
  });

  /**
   * ## Must come BEFORE oauth2 plugin
   */
  await fastify.register(cookieParser, {
    secret: env.COOKIE_SECRET,
    // ...
  });

  // `fastify-oauth2` is a plugin that helps you handle oauth2 flows.
  // It comes with preconfigured settings for the major oauth providers.
  // Are you using Auth0? See https://npm.im/fastify-auth0-verify
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
    callbackUri: 'http://localhost:3000/auth/github/callback',
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
    callbackUri: 'http://localhost:3000/auth/google/callback',
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
    cookieOpts: {
      // signed: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: config.CSRF_TOKEN_EXPIRATION,
      path: '/',
      secure: env.NODE_ENV === 'production',
      expires: new Date(Date.now() + config.CSRF_TOKEN_EXPIRATION),
    },
    csrfOpts: {
      hmacKey: env.CSRF_SECRET,
    },
    // getToken: (req) => req.headers['csrf-token'],
  }); // opts don't work with typescript?

  /**
   * OPTIONAL: fastify-session ( with connect-redis )
   * is an alternative to using jwt for authentication
   * ## If you want to use sessions, you can use the fastify-session plugin
   * with redis store
   */
  // await fastify.register(fastifySession, {
  //     secret: env.SESSION_SECRET,
  //     cookie: {
  //         secure: env.NODE_ENV === 'production',
  //         sameSite: 'lax',
  //         // TODO: no magic numbers
  //         maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  //         path: '/',
  //         httpOnly: true,
  //         expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  //     },
  //     store: redisStore,
  // });

  /**
   * ## Custom Decorators
   */

  fastify.decorate('refreshTokens', refreshTokens);

  // small utility to clear auth tokens from cookies
  fastify.decorateRequest('clearAuthTokens', null);
  fastify.addHook('onRequest', async (req, reply) => {
    req.clearAuthTokens = () => {
      void reply.clearCookie('access_token', {
        path: '/',
      });
      void reply.clearCookie('refresh_token', {
        path: '/',
      });
    };
  });

  // the authenticate decorator will will be used onRequest hook and will set
  // the accessTokenPayload in the request object after a successfull auth
  fastify.decorateRequest('accessTokenPayload', null);
  fastify.decorateRequest('refreshTokenPayload', null);

  // we will ad an onRequest hook to add the tokens. authenticate middleware
  // will refresh the access token if needed. This is used to send the tokens
  // at the end of teh lifecycle
  fastify.decorateRequest('accessToken', '');
  fastify.decorateRequest('refreshToken', '');
  fastify.decorateRequest('csrfToken', '');

  // main logic for authentication, will check if access token is present,
  // valid and not expired. redirects to refresh in case.
  // will set the accessTokenPayload in the request object
  fastify.decorate('authenticate', authenticate);

  // after authentication, this decorator will check if the user is allowed
  // using the access token payload
  fastify.decorate('restrictTo', restrictTo);

  // Decorator to get user info from oauth2 access token after a successful
  // callback from the oauth2 provider
  fastify.decorate('getOauth2EmailFromToken', getOauth2UserInfoFromAccessToken);

  // Decorator to create and set jwt cookie access or refresh token
  fastify.decorate('createSetJwtCookieToken', createSetJwtCookieToken);

  // Decorator to handle oauth2 signup in both callbacks
  fastify.decorate('oauth2SignupHandler', oauth2SignupHandler);

  log.info('🔐 Authorization registered');
};

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: typeof authenticate;
    createSetJwtCookieToken: typeof createSetJwtCookieToken;
    // facebookOAuth2: OAuth2Namespace;
    githubOAuth2: OAuth2Namespace;
    googleOAuth2: OAuth2Namespace;
    // isUserAllowed: typeof isUserAllowed;
    getOauth2EmailFromToken: typeof getOauth2UserInfoFromAccessToken;
    restrictTo: typeof restrictTo;
    oauth2SignupHandler: typeof oauth2SignupHandler;
    redisAuthConnection: Redis;
    refreshTokens: typeof refreshTokens;
  }
  interface FastifyRequest {
    clearAuthTokens: () => void;
    accessTokenPayload: null | TAccessTokenPayload;
    refreshTokenPayload: null | TRefreshTokenPayload;
    accessToken: string | undefined;
    refreshToken: string | undefined;
    csrfToken: string | undefined;
  }
}

const authorization = fp(plugin, {
  name: 'authorization',
  dependencies: ['config', 'environment', 'redis'], // redis is used for jwt whitelist
});

export default authorization;
