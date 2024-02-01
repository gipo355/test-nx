import { Router } from 'express';

import { unsupportedMethodHandler } from '../controllers';

const unsupportedMethodRouter = Router();
unsupportedMethodRouter.route('*').put(unsupportedMethodHandler);
export { unsupportedMethodRouter };
