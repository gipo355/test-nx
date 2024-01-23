/* eslint-disable no-console */
/**
 * https://www.prisma.io/docs/guides/migrate/seed-database
 * ## will get called automatically on
 * prisma db migrate
 *
 * can get called explicitly with prisma db seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('Seeding prisma db .. 🌱');

async function main() {
  /**
   * ## upsert creates if not exists and updates if exists
   */
  const alice = await prisma.user.upsert({
    where: { email: 'gipo355@mailsac.com' },

    update: {},

    create: {
      email: 'gipo355@mailsac.com',
      emailVerified: new Date(),
      firstName: 'Alice',

      accounts: {
        create: {
          strategy: 'LOCAL',
          password: 'test1234',
          passwordConfirm: 'test1234',
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'gipo777@mailsac.com' },

    update: {},

    create: {
      email: 'gipo777@mailsac.com',
      emailVerified: new Date(),
      firstName: 'Bob',

      accounts: {
        create: {
          strategy: 'LOCAL',
          password: 'test1234',
          passwordConfirm: 'test1234',
        },
      },
    },
  });

  console.log({ alice, bob });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch(async (error) => {
    console.error(error);

    await prisma.$disconnect();

    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  });
