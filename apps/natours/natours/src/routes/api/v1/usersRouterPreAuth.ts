// import { createReadStream, readFile } from 'node:fs';

// import { readFileSync, writeFile } from 'node:fs';

// import toursJSON from '../../../../assets/filedb.json';
// import json from '../../../../assets/dev-data/data/tours-simple.json';
import { Router } from 'express';

import {
  deleteUser,
  getAllUsers,
  getUser,
  patchUser,
  postNewUser,
} from '../../../controllers';

// import { Logger } from '../../../loggers';
// import { Logger } from '../../../loggers';

// readFile(json, 'utf8', (_err: any, data: any) => {
//     console.log(data);
// });

// function middleware(_request: any, _response: any, _next: any) {
//     Logger.info('requested specific user route');
//     _next();
// }

// selective middleware
// App.use('/api/v1/users', (_req, _res, _next) => {
//     Logger.info('requested users route');
//     _next();
// });

const router = Router();

router.route('/').get(getAllUsers).post(postNewUser);
router
  .route('/:id')
  .get(getUser) // even more selective middleware
  .patch(patchUser)
  .delete(deleteUser);

// App.get('/api/v1/tours', getAllTours);
// // handling variables in URL
// App.get('/api/v1/tours/:id', getTour);
// App.post('/api/v1/tours', postNewTour);
// App.patch('/api/v1/tours/:id', patchTour);
// App.delete('/api/v1/tours/:id', deleteTour);

export { router as usersRouterV1 };
