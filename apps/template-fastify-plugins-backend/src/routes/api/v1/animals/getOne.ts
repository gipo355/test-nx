import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from 'fastify';

type ParametersType = {
  id: string;
};

export const getOneAnimalSchema: FastifySchema = {
  tags: ['animals'],
  response: {
    200: {
      type: 'object',
      properties: {
        ok: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
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
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
};

export const getOneAnimalHandler = async function getOneAnimalHandler(
  this: FastifyInstance,
  req: FastifyRequest<{ Params: ParametersType }>,
  res: FastifyReply
) {
  // TODO: sanitize input, no magic numbers, encapsulation, error handling ( no next(err)? )
  // if (!req.fastify) {
  //     req.log.error('fastify not found on getOneAnimal');
  //     throw new Error('There was a problem, please try again later');
  // }
  const result = await req.mongo.Animal.findById(req.params.id);

  if (!result) {
    throw new Error('Invalid value');
  }

  return res.send({
    ok: true,
    data: result,
  });
};

export const getOneAnimalErrorHandler = function getOneAnimalErrorHandler(
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
