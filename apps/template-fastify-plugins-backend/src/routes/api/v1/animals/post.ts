import { type Static, Type } from '@fastify/type-provider-typebox';
import type {
  // FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from 'fastify';

const animalBodySchema = Type.Object({
  name: Type.String(),
  origin: Type.Optional(Type.String()),
});

export type AnimalBodySchema = Static<typeof animalBodySchema>;

export const postOneAnimalSchema: FastifySchema = {
  tags: ['animals'],
  body: animalBodySchema,
  response: {
    201: {
      type: 'object',
      properties: {
        ok: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            origin: { type: 'string' },
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

export const postOneAnimalHandler = async function postOneAnimalHandler(
  this: FastifyInstance,
  req: FastifyRequest<{ Body: AnimalBodySchema }>,
  res: FastifyReply
) {
  const { statusCodes } = this;

  // TODO: sanitize, no magic numbers, encapsulation, error handling ( no next(err)? )
  // const animalCollection = req.fastify?.mongo.db?.collection('animals');
  // try {
  const result = await req.mongo.Animal.create(req.body);

  return res.code(statusCodes.created).send({
    ok: true,
    data: result,
  });
  // } catch (error) {
  //     if (error instanceof Error) {
  //         if (error.message.includes('duplicate key error')) {
  //             req.log.error(error);

  //             console.log(error.code);

  //             // error {
  //             //         type: 'MongoServerError'
  //             //         message: 'E11000 duplicate key error collection: test.animals index: name_1 dup key: { name: "cat" }'
  //             //         code: 11000,
  //             //         keyPattern: { name: 1 },
  //             //         keyValue: { name: 'cat' },
  //             // }
  //             // throw new Error('Animal already exists');
  //             await res.code(400).send({
  //                 ok: false,
  //                 error: 'Animal already exists',
  //             });
  //         }
  //         throw new Error('Error creating animal');
  //     }
  // }
};

// export const postOneAnimalErrorHandler = function postOneAnimalErrorHandler(
//     this: FastifyInstance,
//     error: FastifyError,
//     _req: FastifyRequest,
//     res: FastifyReply
// ) {
//     // if (error.message.includes('duplicate key error')) {
//     //     // req.log.error(error);
//     //     // console.log(error.code);
//     //     // error {
//     //     //         type: 'MongoServerError'
//     //     //         message: 'E11000 duplicate key error collection: test.animals index: name_1 dup key: { name: "cat" }'
//     //     //         code: 11000,
//     //     //         keyPattern: { name: 1 },
//     //     //         keyValue: { name: 'cat' },
//     //     // }

//     //     // throw new Error('Animal already exists'); // works

//     //     // works
//     //     // void res.code(400);
//     //     // return {
//     //     //     ok: false,
//     //     //     error: 'Animal already exists',
//     //     // };

//     //     // void res.code(400).send({
//     //     //     ok: false,
//     //     //     error: `Animal already exists`,
//     //     // });
//     //     return res.badRequest('Animal already exists');
//     //     // void res.send(error);
//     // }

//     // else fastify will use parent error handler to handle this
//     // req.log.debug(error);
//     // return res.send(error); // works
//     // throw new Error('Error creating animal'); // works
//     // }

//     throw error;
// };
