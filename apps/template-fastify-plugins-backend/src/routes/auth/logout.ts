import type { RouteHandlerMethod } from 'fastify';

export const logoutHandler: RouteHandlerMethod = async function logoutHandler(
  request,
  reply
) {
  const { config, redisAuthConnection } = this;
  const { session } = request;

  const { user, sessionId } = session;
  await session.destroy();

  // remove session from the set user-sessions:userId
  await redisAuthConnection.srem(
    `${config.SESSION_SET_PREFIX}:${user}`,
    `${config.SESSION_KEY_PREFIX}:${sessionId}`
  );

  // if user has no more sessions, remove the set
  const userSessions = await redisAuthConnection.smembers(
    `${config.SESSION_SET_PREFIX}:${user}`
  );
  if (
    userSessions.length === 0 ||
    userSessions === null ||
    userSessions === undefined
  ) {
    await redisAuthConnection.del(`${config.SESSION_SET_PREFIX}:${user}`);
  }

  return reply.redirect('/');
};
