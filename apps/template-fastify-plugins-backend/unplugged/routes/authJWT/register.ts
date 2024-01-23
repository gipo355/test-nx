import { Type } from '@fastify/type-provider-typebox';
// import type { Static } from '@sinclair/typebox';
import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from 'fastify';

export const registerBodySchema = Type.Object({
  email: Type.String({
    format: 'email',
  }),
  password: Type.String(),
  passwordConfirm: Type.String(),
  name: Type.Optional(
    Type.String({
      minLength: 3,
      maxLength: 40,
    })
  ),
});

const userSchema = Type.Object({
  id: Type.String(),
  email: Type.String({
    format: 'email',
  }),
});

export const registerSchema: FastifySchema = {
  tags: ['auth'],
  body: registerBodySchema,
  response: {
    201: {
      type: 'object',
      properties: {
        ok: { type: 'boolean' },
        data: userSchema,
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

export const registerHandler = async function registerHandler(
  this: FastifyInstance
  // req: FastifyRequest<{ Body: Static<typeof registerBodySchema> }>,
  // res: FastifyReply
) {
  // TODO: sanitize, no magic numbers, encapsulation, error handling ( no next(err)? )
  // const animalCollection = req.fastify?.mongo.db?.collection('animals');
  // const user = await req.prisma.user.create({
  //     data: {
  //         email: req.body.email,
  //         accounts: {
  //             create: {
  //                 provider: 'local',
  //                 password: req.body.password,
  //                 passwordConfirm: req.body.passwordConfirm,
  //             },
  //         },
  //     },
  // });
  // const account = await this.prisma.account.create({
  //     data: {
  //         provider: 'local',
  //         password: req.body.password,
  //         passwordConfirm: req.body.passwordConfirm,
  //         User: {
  //             connectOrCreate: {
  //                 where: {
  //                     email: req.body.email,
  //                 },
  //                 create: {
  //                     email: req.body.email,
  //                 },
  //             },
  //         },
  //     },
  //     include: {
  //         User: true,
  //     },
  // });
  // const { email, password, passwordConfirm, name } = req.body;
  // if (!isEmail(email) || !isAscii(password) || !isAscii(passwordConfirm)) {
  //     await res.code(400).send({
  //         ok: false,
  //         error: 'Invalid email or password',
  //     });
  //     return;
  // }
  // if (password !== passwordConfirm) {
  //     await res.code(400).send({
  //         ok: false,
  //         error: 'Passwords do not match',
  //     });
  //     return;
  // }
  // const user = await req.prisma.user.create({});
  // await res.code(201).send({
  //     ok: true,
  //     data: account.User,
  // });
};

export const registerErrorHandler = (
  error: FastifyError,
  _req: FastifyRequest,
  res: FastifyReply
) => {
  void res.send(error);
};
