import type { FastifyInstance, FastifyRequest } from 'fastify';

export const restrictTo = (roles: Roles) =>
  async function inner(this: FastifyInstance, req: FastifyRequest) {
    const { httpErrors } = this;
    const { accessTokenPayload } = req;

    if (!accessTokenPayload) {
      throw httpErrors.unauthorized('Please login again');
    }

    const { role } = accessTokenPayload;

    if (!roles.includes(role as Roles[number])) {
      throw httpErrors.forbidden('Forbidden');
    }
  };
