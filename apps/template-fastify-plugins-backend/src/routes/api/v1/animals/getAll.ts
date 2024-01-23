import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  // FastifySchema,
  // RouteShorthandOptionsWithHandler,
  // RouteShorthandOptions,
  // RouteShorthandOptionsWithHandler,
  FastifySchema,
} from 'fastify';

export const getAllAnimalsSchema: FastifySchema = {
  tags: ['animals'],
  response: {
    200: {
      type: 'object',
      properties: {
        ok: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
            },
          },
        },
      },
    },
    // 500: {
    //     type: 'object',
    //     properties: {
    //         statusCode: { type: 'number' },
    //         error: { type: 'string' },
    //         message: { type: 'string' },
    //     },
    // },
  },
};

export const getAllAnimalsHandler = async function getAllAnimalsHandler(
  this: FastifyInstance,
  req: FastifyRequest,
  res: FastifyReply
) {
  const { mongo } = req;

  const animalsCollection = await mongo.Animal.find();

  // this.Sentry.captureMessage('Blocked user tried to get in');

  // TODO: test bullmq when fixed
  // await bullmqQueue1.add('testJob', {
  //     test: 'bullmqJob1',
  // });

  // await prisma.transaction([
  //     prisma.user.count(),
  //     prisma.user.findMany({
  //         take: 5,
  //         cursor: {
  //             id: 5,
  //         },
  //     }),
  // ]);

  // if (animalsCollection.length === 0) {
  //     throw new Error('No documents found');
  // }

  return res.send({
    ok: true,
    data: animalsCollection,
  });
};

export const getAllAnimalsErrorHandler = function getAllAnimalsErrorHandler(
  this: FastifyInstance,
  error: FastifyError,
  _req: FastifyRequest,
  res: FastifyReply
) {
  // if (error instanceof Error) {
  if (error.message.includes('duplicate key error')) {
    // req.log.error(error);
    // console.log(error.code);
    // error {
    //         type: 'MongoServerError'
    //         message: 'E11000 duplicate key error collection: test.animals index: name_1 dup key: { name: "cat" }'
    //         code: 11000,
    //         keyPattern: { name: 1 },
    //         keyValue: { name: 'cat' },
    // }

    // throw new Error('Animal already exists'); // works

    // works
    // void res.code(400);
    // return {
    //     ok: false,
    //     error: 'Animal already exists',
    // };

    return res.code(400).send({
      ok: false,
      error: `Animal already exists`,
    });
    // void res.send(error);
  }
  // else fastify will use parent error handler to handle this
  // req.log.debug(error);
  return res.send(error); // works

  // throw new Error('Error creating animal'); // works
  // }
};
