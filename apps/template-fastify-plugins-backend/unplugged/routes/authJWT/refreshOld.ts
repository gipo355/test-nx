import { Type } from '@sinclair/typebox';
import type { RouteHandlerMethod } from 'fastify';

export const refreshSchema = {
  tags: ['auth'],
  description:
    'Refresh access token with refresh token and generate new csrf token',
  response: {
    200: Type.Object({
      csrfToken: Type.String(),
    }),
  },
};

export const refreshHandler: RouteHandlerMethod = async function refresh(
  request,
  reply
) {
  /**
   * ## Notes
   * when a refresh token is used, it should become invalid
   * github oauth lasts 1 year. can be revoked
   */
  const {
    log,
    httpErrors,
    statusCodes,
    jwt,
    createSetJwtCookieToken,
    prisma,
    redisAuthConnection,
  } = this;

  const { refresh_token: refreshToken } = request.cookies;

  /**
   * ## Check if refresh token is present and valid
   */
  if (refreshToken === undefined || !refreshToken || refreshToken === '') {
    request.clearAuthTokens();
    throw httpErrors.unauthorized('no refresh token');
  }

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
  createSetJwtCookieToken(this, reply, {
    type: 'access_token',
    payload: {
      id: account.userId,
      role: account.User.role,
      email: account.User.email,
    },
  });

  /**
   * ## Invalidate refresh token used ( add to blacklist in db )
   * we need expiration to clear the db
   */
  await redisAuthConnection.del(`${payload.id}:${payload.jti}`);

  /**
   * ## Create new refresh token
   */
  const { jti } = createSetJwtCookieToken(this, reply, {
    type: 'refresh_token',
    payload: {
      id: account.userId,
      strategy: payload.strategy,
    },
  });
  /**
   * ## Whitelist refresh token
   */
  await redisAuthConnection.set(
    `${account.userId}:${jti}`,
    1,
    'EX',
    60 * 60 * 24 * 7
  );

  /**
   * ## Send csrf token and access token + set cookie
   */
  // TODO: must handle the request client side with interceptors
  // the client must receive a 404 if authenticaion fails and then try to refresh
  // if refresh fails, then redirect to login
  // if refresh succeeds, then retry the original request
  // use ky with retry and beforeRetry
  // reply.generateCsrf();
  const csrfToken = reply.generateCsrf();

  // return reply.redirect('/dashboard');
  return reply.code(statusCodes.ok).send({
    csrfToken,
  });
};
