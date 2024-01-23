import type { FastifyInstance, FastifyRequest } from 'fastify';

export const restrictTo = (roles: Roles) =>
  async function inner(this: FastifyInstance, req: FastifyRequest) {
    const { httpErrors } = this;
    const { session } = req;

    if (!session.user) {
      throw httpErrors.unauthorized('Please login again');
    }

    const { role } = session;

    if (!roles.includes(role)) {
      throw httpErrors.forbidden('Forbidden');
    }
  };
