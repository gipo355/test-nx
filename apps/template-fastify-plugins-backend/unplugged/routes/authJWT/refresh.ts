import { Type } from '@sinclair/typebox';
import type { RouteHandlerMethod } from 'fastify';

export const refreshSchema = {
  tags: ['auth'],
  description:
    'Refresh access token with refresh token and generate new csrf token',
  response: {
    200: Type.Object({
      csrfToken: Type.String(),
      accessToken: Type.String(),
      refreshToken: Type.String(),
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
  const { httpErrors, statusCodes } = this;

  const { refresh_token: refreshToken } = request.cookies;

  /**
   * ## Check if refresh token is present and valid
   */
  if (refreshToken === undefined || !refreshToken || refreshToken === '') {
    request.clearAuthTokens();
    throw httpErrors.unauthorized('no refresh token');
  }

  const { newAccessToken, newRefreshToken, newCsrfToken } =
    await this.refreshTokens(this, request, reply, refreshToken);

  return reply.code(statusCodes.ok).send({
    csrfToken: newCsrfToken,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};
