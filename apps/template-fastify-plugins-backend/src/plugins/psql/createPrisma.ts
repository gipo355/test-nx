import { Prisma, PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';

export const createPrisma = (fastify: FastifyInstance) => {
  /**
   * ## RAW PRISMA CLIENT
   * only global extensions here
   * use and reexport prisma client from prismaExtended.ts which includes
   * all models extensions
   */

  /**
   * ## find extensions examples in:
   * [https://github.com/prisma/prisma-client-extensions/tree/main]
   * [https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions/shared-extensions]
   */

  const prisma = new PrismaClient({
    log:
      fastify.env.NODE_ENV === 'production'
        ? ['warn', 'error']
        : ['query', 'info', 'warn', 'error'],
  }).$extends({
    query: {
      user: {
        /**
         * ## Hash password before creating user
         * can do here or on account, depends how you structure the query
         * and what you call with create()
         * if you call create() on user, then you can hash password here
         * and nest create the account
         * if you call create() on account, then you can hash password
         * on account and nest connectOrCreate the user (including the user
         * in the result)
         */
        // async create({ args, query }) {
        //     logger.info('create user');
        //     if (!args.data?.accounts?.create) return query(args);
        //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     const accountObject = args.data?.accounts?.create as any;
        //     const password = accountObject?.password;
        //     if (password === undefined) return query(args);
        //     const hashedPassword = await autoHashPassword(password);
        //     accountObject.password = hashedPassword;
        //     // eslint-disable-next-line no-param-reassign
        //     args.data.accounts.create = accountObject;
        //     return query(args);
        // },
      },

      account: {
        async create({ args, query }) {
          fastify.log.info('create account', args);
          if (args.data?.password === undefined || args.data?.password === '')
            return query(args);

          const { data } = args;
          data.password = await fastify.workerpools.proxy1.hashPassword(
            data.password as string
          );
          const newArguments = { ...args, data };
          return query(newArguments);
        },
        async update({ args, query }) {
          if (args.data?.password === '' || args.data?.password === undefined)
            return query(args);

          const { data } = args;
          data.password = await fastify.workerpools.proxy1.hashPassword(
            data.password as string
          );
          const newArguments = { ...args, data };
          return query(newArguments);
        },
      },
    },

    model: {
      $allModels: {
        async exists<T>(
          this: T,
          where: Prisma.Args<T, 'findFirst'>['where']
        ): Promise<boolean> {
          // Get the current model at runtime
          const context = Prisma.getExtensionContext(this);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = await (context as any).findFirst({ where });

          return result !== null;
        },
      },

      user: {
        async comparePassword(email: string, password: string) {
          const context = Prisma.getExtensionContext(this);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const userWithAccount = await (context as any).findFirst({
            where: {
              email,
            },
            select: {
              accounts: {
                where: {
                  provider: 'local',
                },
                select: {
                  password: true,
                },
              },
            },
          });

          if (
            userWithAccount === null ||
            userWithAccount.accounts.length === 0 ||
            userWithAccount.accounts === undefined
          )
            return false;

          const [account] = userWithAccount.accounts;

          const isPasswordValid =
            await fastify.workerpools.proxy1.verifyPassword(
              account.password,
              password
            );

          return isPasswordValid;
        },
      },
    },
  });

  return prisma;
};
