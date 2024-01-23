import type { RouteHandlerMethod } from 'fastify';

export const logoutHandler: RouteHandlerMethod = async function logoutHandler(
  request,
  reply
) {
  /**
   * ## Clear the refresh token from redis
   */

  const { redis, jwt } = this;
  const { refresh_token: refreshToken } = request.cookies;

  if (refreshToken === undefined || !refreshToken || refreshToken === '') {
    request.clearAuthTokens();
    return reply.redirect('/');
  }

  const payload: TRefreshTokenPayload = jwt.verify(refreshToken);

  await redis.del(`${payload.id}:${payload.jti}`);

  /**
   * ## Delete the cookies
   */

  request.clearAuthTokens();

  return reply.redirect('/');
};
