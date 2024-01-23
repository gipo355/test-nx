import type { RouteHandlerMethod } from 'fastify';

export const logoutAllHandler: RouteHandlerMethod =
  async function logoutHandler(request, reply) {
    // const { config, redisAuthConnection, httpErrors } = this;
    // const { session } = request;

    // const { user } = session;

    // // get all sessions from the set user-sessions:userId and delete the keys
    // const userSessions = await redisAuthConnection.smembers(
    //     `${config.SESSION_SET_PREFIX}:${user}`
    // );
    // if (
    //     userSessions.length === 0 ||
    //     userSessions === null ||
    //     userSessions === undefined
    // ) {
    //     throw httpErrors.notFound('No sessions found');
    // }

    // await redisAuthConnection.del(userSessions);
    // await session.destroy();

    // // delete the set
    // await redisAuthConnection.del(`${config.SESSION_SET_PREFIX}:${user}`);

    await request.removeAllUserSessions();

    return reply.redirect('/');
  };
