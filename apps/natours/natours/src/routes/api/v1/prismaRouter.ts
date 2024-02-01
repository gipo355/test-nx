import { Router } from 'express';

import { prismaFindAll } from '../../../controllers';

const router = Router();

router.route('/').get(prismaFindAll);

export { router as prismaRouterV1 };
