import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const handler = async function handler(
  this: FastifyInstance,
  _req: FastifyRequest,
  res: FastifyReply
) {
  // this.log.debug(this.testingShit);
  // console.log(this.testingShit);

  await res.code(200).send('route not implemented');
};
