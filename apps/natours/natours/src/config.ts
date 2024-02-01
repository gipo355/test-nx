import os, { availableParallelism } from 'node:os';

import type { CookieOptions } from 'express';

/** *****************************
* GLOBALS
/****************************** */

// set threads and pools
// can get number of cores available for automatically setting threads
const systemCpuCores = os.cpus().length;
export const suggestedThreadSize = systemCpuCores > 4 ? systemCpuCores - 1 : 4;
export const UV_THREADPOOL_SIZE = 4; // prefer use as ENV

// worker pool
export const WORKER_POOL_ENABLED = '1'; // '1' or undefined

// limit functionality mongoose
export const DEFAULT_LIMIT_PER_PAGE = 100;
export const DEFAULT_PAGE = 1;

// salt for bcrypt
export const SALT_WORK_FACTOR = 10;

// pool worker size
// export const POOL_MIN_WORKERS = 'max';
// export const POOL_MAX_WORKERS = '';
export const POOL_MIN_WORKERS = undefined; // max sets min to n of max workers ( cores - 1 is the default max if undefined)
export const POOL_MAX_WORKERS = 4; // default is cores - 1

/**
 * ## Parallelism for cluster
 */
export const IS_CLUSTER_ENABLED = !(process.env.DEBUG === undefined) && false;
export const maxParallelism = process.env.NODE_ENV === 'development' ? 0 : 3;
// get up to maxParallelism if cpus is superior to maxParallelism
// otherwise the number of cpus available
export const maxClusters = // this is numCpu
  availableParallelism() >= maxParallelism
    ? maxParallelism
    : availableParallelism(); // 24

// compression IF NGINX compression not present (gzip)
export const COMPRESSION_ENABLED = false;

/**
 * ## JWT COOKIES
 */
const cookieExpiryDays = 10; // make it equal to env variable JWT_EXPIRY
export const JWT_COOKIE_OPTIONS: CookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * cookieExpiryDays,
  // expires: 'GMT date', // alternative way to max-age, can use Date.now() + ms
  httpOnly: true, // prevent javascript from accessingit
  // path: '/api/v1/users/', // path from the root to send it on req, default to path of request. if using / = access on every resource
  path: '/',
  // domain: '', // if you specify the domain (main.com), all sub-domains will receive it (sub.main.com), if no domain: only to main.com
  sameSite: 'lax', // strict, lax, none
  // secure: process.env.NODE_ENV === 'production', // will only send if https
  secure: true,
  // signed: true, // sign the cookie for additional tamper poof, requires req.signedCookies['test'] (or req.signedCookies.test) to read. uses the secret in globalMiddleware
  // signed is not needed with jwt, it's already signed
};

// random bytes for reset tokens
export const RANDOM_BYTES_VALUE = 56;
export const RESET_TOKEN_EXPIRY_MINS = 5;

// HTTP protocol
export const HTTP_PROTOCOL = 'http';

// api version
export const CURRENT_API_VERSION = 'v1';

/**
 * ## swagger server
 */
export const IS_SWAGGER_SERVER_ENABLED = true;

/**
 * ## typedoc server
 */

export const IS_TYPEDOC_SERVER_ENABLED = false;

/**
 * ## exp status
 */
export const IS_EXPRESS_STATUS_MONITORING_ON = false;

/**
 * ## DELAY FOR PASSWORD LAST MODIFIED IN MILLISECOND: AVOID CONFLICTS WITH JWT IAT
 */
export const LAST_MODIFIED_DELAY_MS = 1000;

/**
 * ## dependency cruiser endpoint enabledj
 */
export const IS_DEP_CRUISER_ENABLED = true;

/**
 * ## CSRF PROT
 */
export const CSRF_ENABLED = false;
export const CSRF_SECURE_COOKIES_ENABLED = false;

/**
 * ## ENABLE HTTPS
 *
 * in production, we don't want to enable https
 * usually the server has caddy/nginx to handle https
 * make sure secure cookies are proxied though
 */
// export const IS_HTTPS_ENABLED = process.env.NODE_ENV === 'development';
export const IS_HTTPS_ENABLED = false;

/**
 * ## PROXY / LOAD BALANCER
 * more info on express-rate-limit
 */
export const IS_PROXY_ENABLED = false;
export const NUMBERS_OF_PROXIES = 1; // need to increaase count until the req IP is the real client IP

/**
 * ## RATE LIMITER
 */
export const GLOBAL_RATE_LIMITER_ENABLED = false;
export const API_RATE_LIMITER_ENABLED = true;
export const RATE_LIMITER_POINTS = 100;
export const RATE_LIMITER_DURATION = 60 * 60; // seconds

/**
 * ## SENTRY
 */
export const IS_SENTRY_ENABLED = false;

/**
 * ## IMAGEKIT
 */
export const IS_IMAGEKIT_ENABLED = true;

/**
 * ## Useless var for logging atm
 */
export const EMAIL_PROVIDER = 'Mailtrap';

/**
 * ## New User expiresAt in minutes
 */
export const NEW_USER_EXPIRES_AT = 10; // minutes
