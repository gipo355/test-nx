import { prisma } from '../../../database/postgres/prisma';
import { catchAsync } from '../../../helpers';

const prismaFindAll = catchAsync(async () => {
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
});

export { prismaFindAll };
