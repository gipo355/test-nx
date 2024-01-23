import type { FastifyInstance, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

import type { TAccessTokenPayload } from '../schemas/schemas.js';

type JwtOptions =
  | {
      type: 'access_token';
      payload: TAccessTokenPayload;
    }
  | {
      type: 'refresh_token';
      payload: TRefreshTokenPayload;
    };

export const createSetJwtCookieToken = function createSetJwtCookie(
  fastify: FastifyInstance,
  reply: FastifyReply,
  { type, payload }: JwtOptions,
  setCookie = true
) {
  const { jwt, env, config } = fastify;

  // The JWT specification defines seven reserved claims that are not required,
  // but are recommended to allow interoperability with third-party applications.
  // These are:
  // iss (issuer): Issuer of the JWT
  // sub (subject): Subject of the JWT (the user)
  // aud (audience): Recipient for which the JWT is intended
  // exp (expiration time): Time after which the JWT expires
  // nbf (not before time): Time before which the JWT must not be accepted for processing
  // iat (issued at time): Time at which the JWT was issued; can be used to determine age of the JWT
  // jti (JWT ID): Unique identifier; can be used to prevent the JWT from being replayed (allows a token to be used only once)

  const jti = uuidv4();
  const token = jwt.sign(payload, {
    expiresIn: type === 'access_token' ? '5m' : '30d',
    ...(type === 'refresh_token' && { jti }),
  });

  if (setCookie)
    void reply.setCookie(type, token, {
      // The cookie should be sent only over https
      secure: env.NODE_ENV === 'production',
      // The cookie should not be accessible via js in the browser
      httpOnly: true,
      // The cookie should be sent only to this domain
      sameSite: 'lax',
      // The cookie should be sent only for the path starting with `/_app`
      path: '/',
      // The cookie should be signed (handled by `fastify-cookie`), NOTE jwt is already tamper proof
      // signed: true,
      // and last only 1 week
      maxAge:
        type === 'access_token'
          ? config.ACCESS_TOKEN_EXPIRATION
          : config.REFRESH_TOKEN_EXPIRATION,
      expires:
        type === 'access_token'
          ? new Date(Date.now() + config.ACCESS_TOKEN_EXPIRATION)
          : new Date(Date.now() + config.REFRESH_TOKEN_EXPIRATION),
    });

  return { token, jti };
};
