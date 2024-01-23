import { Type } from '@sinclair/typebox';
import type { RouteHandlerMethod } from 'fastify';

export const validateSchema = {
  tags: ['auth'],
  description:
    'Validate access token for authorization. Takes an access token and returns its payload if valid',
  response: {
    200: Type.Object({
      csrfToken: Type.Optional(Type.String()),
      accessToken: Type.Optional(Type.String()),
      refreshToken: Type.Optional(Type.String()),
    }),
  },
};

/**
 * ## This route is used by sveltekit to check if the user is authenticated and
 * get the role of the user
 * it requires a valid access token
 * authenticate middleware will set the access token payload on the request
 */
export const validateHandler: RouteHandlerMethod = async function refresh(
  request,
  reply
) {
  /**
   * ## Notes
   * when a refresh token is used, it should become invalid
   * github oauth lasts 1 year. can be revoked
   */
  const { httpErrors, statusCodes } = this;
  const {
    accessTokenPayload,
    refreshTokenPayload,
    csrfToken,
    accessToken,
    refreshToken,
  } = request;

  // if accessTokenPayload is present, then user is authenticated from the
  // authenticate middleware
  if (!accessTokenPayload) {
    throw httpErrors.unauthorized('3500: Validation failed');
  }

  // if refreshTokenPayload is present, then tokens were refreshed from
  // authenticate middleware using refresh
  if (refreshTokenPayload) {
    return reply.code(statusCodes.ok).send({
      csrfToken,
      accessToken,
      refreshToken,
    });
  }

  /**
   * ## TODO: here and wherever authenticate is used, i need to check if:
   *
   * accessTokenPayload is present ( means user is authenticated )
   * refreshToken is present ( means tokens were refreshed )
   */

  return reply.code(statusCodes.ok).send({
    accessTokenPayload,
  });
};
