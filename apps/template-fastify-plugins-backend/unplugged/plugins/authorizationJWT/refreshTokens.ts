import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import type { TAccessTokenPayload } from '../schemas/schemas.js';

export const refreshTokens = async function refresh(
  fastify: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
  refreshToken: string
) {
  /**
   * ## Notes
   * when a refresh token is used, it should become invalid
   * github oauth lasts 1 year. can be revoked
   */
  const {
    log,
    httpErrors,
    jwt,
    createSetJwtCookieToken,
    prisma,
    redisAuthConnection,
    config,
  } = fastify;

  /**
   * ## Check if jwt is valid
   */

  let payload: TRefreshTokenPayload;

  try {
    payload = jwt.verify(refreshToken);
  } catch {
    request.clearAuthTokens();
    throw httpErrors.unauthorized('Invalid refresh token');
  }

  /**
   * ## Check if refresh token is whitelisted in redis
   */
  if (payload.jti === undefined || !payload.jti || payload.jti === '') {
    request.clearAuthTokens();
    throw httpErrors.unauthorized('Invalid refresh token. No jti');
  }

  const whitelisted = await redisAuthConnection.get(
    `${payload.id}:${payload.jti}`
  );

  if (
    whitelisted === null ||
    !whitelisted ||
    whitelisted === '' ||
    whitelisted === undefined
  ) {
    request.clearAuthTokens();
    log.warn(
      `blacklsted refresh token used: ${refreshToken} for user ${payload.id}`
    );
    throw httpErrors.unauthorized('Invalid refresh token');
  }

  /**
   * ## Get user from database. Do i really need this?
   */
  const account = await prisma.account.findUnique({
    where: {
      userId_strategy: {
        userId: payload.id,
        strategy: payload.strategy,
      },
    },
    include: {
      User: true,
    },
  });

  if (!account) {
    // if account doesn't exist, it's been deleted prior to refresh exp
    request.clearAuthTokens();
    throw httpErrors.badRequest(
      'User associated with this token does not exist'
    );
  }

  /**
   * ## Create access token using refresh token
   */
  const newAccessTokenPayload: TAccessTokenPayload = {
    id: account.userId,
    role: account.User.role,
    email: account.User.email,
  };
  const { token: newAccessToken } = createSetJwtCookieToken(fastify, reply, {
    type: 'access_token',
    payload: newAccessTokenPayload,
  });

  /**
   * ## Invalidate refresh token used ( add to blacklist in db )
   * we need expiration to clear the db
   */
  await redisAuthConnection.del(`${payload.id}:${payload.jti}`);

  /**
   * ## Create new refresh token
   */
  const newRefreshTokenPayload: TRefreshTokenPayload = {
    id: account.userId,
    strategy: payload.strategy,
  };
  const { token: newRefreshToken, jti } = createSetJwtCookieToken(
    fastify,
    reply,
    {
      type: 'refresh_token',
      payload: newRefreshTokenPayload,
    }
  );
  /**
   * ## Whitelist refresh token
   */
  await redisAuthConnection.set(
    `${account.userId}:${jti}`,
    1,
    'EX',
    config.REFRESH_TOKEN_EXPIRATION / 1000
  );

  // generate csrf token
  const newCsrfToken = reply.generateCsrf();

  request.accessToken = newAccessToken;
  request.refreshToken = newRefreshToken;
  request.csrfToken = newCsrfToken;
  request.accessTokenPayload = newAccessTokenPayload;
  request.refreshTokenPayload = newRefreshTokenPayload;

  return {
    newCsrfToken,
    newAccessToken,
    newAccessTokenPayload,
    newRefreshToken,
    newRefreshTokenPayload,
  };
};
