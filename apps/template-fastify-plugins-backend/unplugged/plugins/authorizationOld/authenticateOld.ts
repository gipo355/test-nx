import type {
  FastifyInstance,
  // FastifyReply,
  FastifyRequest,
  // HookHandlerDoneFunction,
} from 'fastify';

import type { TAccessTokenPayload } from '../schemas/schemas.js';

/**
 * ## Custom Decorator to be used in hook to validate accessToken jwt
 */
export const authenticate = async function inner(
  this: FastifyInstance,
  req: FastifyRequest
) {
  const { jwt, httpErrors, compiledSchemas } = this;

  const { access_token: accessToken } = req.cookies;

  if (accessToken === undefined) {
    /**
     * ## HERE we should throw an error
     * the client should use interceptors to call refresh instead
     */
    throw httpErrors.unauthorized('no access token');
  }

  // TODO: should i use typebox to make the schemas and validate those at runtime?
  let token: TAccessTokenPayload;

  try {
    token = jwt.verify(accessToken);
  } catch {
    return httpErrors.unauthorized('Invalid access token');
  }

  // verify that the access token conforms to the schema
  if (!compiledSchemas.AccessTokenPayloadSchema.Check(token)) {
    throw httpErrors.badRequest('Access token malformed');
  }

  req.accessTokenPayload = token;
};
