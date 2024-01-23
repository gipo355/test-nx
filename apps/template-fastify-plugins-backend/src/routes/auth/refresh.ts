import { Type } from '@sinclair/typebox';
import type { RouteHandlerMethod } from 'fastify';

export const refreshSchema = {
  tags: ['auth'],
  description:
    'Refresh access token with refresh token and generate new csrf token',
  response: {
    200: Type.Object({
      csrfToken: Type.String(),
      session: Type.String(),
    }),
  },
};

export const refreshHandler: RouteHandlerMethod = async function refresh(
  request,
  reply
) {
  const { config, redisAuthConnection, httpErrors, statusCodes } = this;

  /**
   * ## The refresh can send back to redirect origin
   * we call /refresh?redirect=origin
   */

  const { redirect } = request.query as { redirect?: string };

  if (!request.session.user) {
    throw httpErrors.unauthorized('RE01: Please login again');
  }

  // IMP: be careful about mutations. regenerate mutates the session object
  // on teh request object. if you destructure it, you will not get the updated
  // session id
  const oldId = request.session.sessionId;

  await request.session.regenerate([
    'user',
    'role',
    'email',
    'strategy',
    'ip',
    'userAgent',
  ]);

  // delete the old session from redis
  // NOTE: we won't delete the old session. we need it as a blacklist
  // if a token got removed from teh set but is reused, we delete all user
  // sessions.
  // we need it in the db to check the used token user
  // await redisAuthConnection.del(`${config.SESSION_KEY_PREFIX}:${oldId}`);

  // remove it from the set user-sessions:userId
  await redisAuthConnection.srem(
    `${config.SESSION_SET_PREFIX}:${request.session.user}`,
    `${config.SESSION_KEY_PREFIX}:${oldId}`
  );
  // add the new session to the set user-sessions:userId
  await redisAuthConnection.sadd(
    `${config.SESSION_SET_PREFIX}:${request.session.user}`,
    `${config.SESSION_KEY_PREFIX}:${request.session.sessionId}`
  );

  const newCsrfToken = reply.generateCsrf();

  // TODO: security, what about a different website redirect?
  // www.hacksite.com
  // could also just redirect to originalUrl
  if (redirect) {
    return reply.redirect(303, redirect);
  }

  return reply.code(statusCodes.ok).send({
    session: request.session.encryptedSessionId,
    csrfToken: newCsrfToken,
  });
};
