import type { RouteHandlerMethod } from 'fastify';

export const logoutAllHandler: RouteHandlerMethod =
  async function logoutHandler(request, reply) {
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

    /**
     * ## Delete all refresh tokens for this user. format is id:jti
     */
    const keys = await redis.keys(`${payload.id}:*`);
    // console.log('keys', keys);
    await redis.del(keys);

    /**
     * ## Delete the cookies
     */

    request.clearAuthTokens();

    return reply.redirect('/');
  };
