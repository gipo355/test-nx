import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const handler = async function handler(
  this: FastifyInstance,
  req: FastifyRequest,
  res: FastifyReply
) {
  const { statusCodes } = this;
  return res.code(statusCodes.ok).send(req.params);
};
