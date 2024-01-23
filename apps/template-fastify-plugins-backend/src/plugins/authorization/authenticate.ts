import type {
  FastifyInstance,
  // FastifyReply,
  FastifyRequest,
  // HookHandlerDoneFunction,
} from 'fastify';

// import type { TAccessTokenPayload } from '../schemas/schemas.js';

/**
 * ## Custom Decorator to be used in hook to validate accessToken jwt
 *
 * At the end of this logic, user is authenticated if request.accessTokenPayload
 * is set
 * If req.refreshToken is set, send all new tokens to the client
 */
export const authenticate = async function inner(
  this: FastifyInstance,
  req: FastifyRequest
  // res: FastifyReply
) {
  const { httpErrors, redisAuthConnection, config } = this;

  if (!req.session.user) {
    throw httpErrors.unauthorized('Please login again, no session');
  }
  // TODO: we check if the session with the user is inside the set
  // if a token gets rotated, it is removed from teh set.
  // and is used again and is not part of the set, log out the user everywhere
  // and delete the session + the entire set from redis
  const isMember = await redisAuthConnection.sismember(
    `${config.SESSION_SET_PREFIX}:${req.session.user}`,
    `${config.SESSION_KEY_PREFIX}:${req.session.sessionId}`
  );
  if (isMember === 0) {
    await req.removeAllUserSessions();
    throw httpErrors.unauthorized('Token already rotated. Please login again');
  }

  // TODO: all user sessions must expire upon password change

  // TODO: ability to blacklist users

  // TODO: if sveltekit, we must get it from the header or body here and
  // wherever we read them from cookies
};
