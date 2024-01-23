import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  // HookHandlerDoneFunction,
} from 'fastify';

import type { TAccessTokenPayload } from '../schemas/schemas.js';

/**
 * ## Custom Decorator to be used in hook to validate accessToken jwt
 *
 * At the end of this logic, user is authenticated if request.accessTokenPayload
 * is set
 * If req.refreshToken is set, send all new tokens to the client
 */
export const authenticate = async function inner(
  this: FastifyInstance,
  req: FastifyRequest,
  res: FastifyReply
) {
  const {
    jwt,
    httpErrors,
    // compiledSchemas,
  } = this;

  // TODO: ability to blacklist users

  // TODO: move to blacklist of tokens instead

  // we store the active refresh tokens in redis as whitelist
  // we make another blacklist of refresh tokens
  // when blacklisting, remove the refresh token from whitelist and add to
  // blacklist. can blacklist all active tokens like this, or all tokens for
  // a user.
  // blacklist should be TTL same as whitelist(jwt expiry)
  // we only check against the blacklist

  // TODO: if sveltekit, we must get it from the header or body here and
  // wherever we read them from cookies
  const { access_token: accessToken, refresh_token: refreshToken } =
    req.cookies;

  // if no tokens, throw
  if (!accessToken && !refreshToken) {
    throw httpErrors.unauthorized('no tokens');
  }

  // if only refresh token, validate it and refresh all tokens and add them
  // to the request.
  // we will be able to check if req.accessTokenPayload is set
  // if access token is set, skip and validate existing
  if (!accessToken && refreshToken) {
    // console.log('refresh token used, tokens refreshed');
    const {
      newCsrfToken,
      newAccessToken,
      newRefreshToken,
      newAccessTokenPayload,
      newRefreshTokenPayload,
    } = await this.refreshTokens(this, req, res, refreshToken);
    req.csrfToken = newCsrfToken;
    req.accessToken = newAccessToken;
    req.refreshToken = newRefreshToken;
    req.accessTokenPayload = newAccessTokenPayload;
    req.refreshTokenPayload = newRefreshTokenPayload;
  }
  // if access token is set, validate it and set the payload in the request
  else if (accessToken) {
    let accessTokenPayload: TAccessTokenPayload;

    try {
      accessTokenPayload = jwt.verify(accessToken);
    } catch {
      return httpErrors.unauthorized('Invalid access token');
    }

    // verify that the access token conforms to the schema
    // if (
    //     !compiledSchemas.AccessTokenPayloadSchema.Check(accessTokenPayload)
    // ) {
    //     throw httpErrors.badRequest('Access token malformed');
    // }

    req.accessTokenPayload = accessTokenPayload;
  } else {
    throw httpErrors.unauthorized('no tokens');
  }
};
