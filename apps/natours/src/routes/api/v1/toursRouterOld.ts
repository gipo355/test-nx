// import { createReadStream, readFile } from 'node:fs';

import // blockIDInsertionMiddleware,
// blockIfBodyIsEmpty,
// checkRequiredKeys,
// // checkTourId,
// // deleteTour,
// getAllTours,
// getTour,
// patchTour,
// postNewTour,
// validateAllKeys,
'../../../controllers';

import { Router } from 'express';

// import toursJSON from '../../../../assets/filedb.json';
import { Logger } from '../../../loggers';
// import { Logger } from '../../../loggers';

// readFile(json, 'utf8', (_err: any, data: any) => {
//     console.log(data);
// });

function middleware(_request: any, _response: any, _next: any) {
  Logger.info('requested tours route 1');
  _next();
}
function middlewareGet(_request: any, _response: any, _next: any) {
  Logger.info('requested tours get route 2');
  _next();
}
function middlewareSpecificSubResource(
  _request: any,
  _response: any,
  _next: any
) {
  Logger.info('requested specific subresource :id route 3');
  _next();
}
function middlewareSpecificSubResourceGetMethod(
  _request: any,
  _response: any,
  _next: any
) {
  Logger.info('requested specific subresource :id get method route 4');
  _next();
}

// selective middleware
// App.use('/api/v1/tours', (_req, _res, _next) => {
//     Logger.info('requested tours route');
//     _next();
// });

// convention to call it router
// but since we are using named exports, we give it the name we want it to be imported with

// can add multiple middleware, order matters

// App.route('/api/v1/tours').get(getAllTours).post(postNewTour);
// App.route('/api/v1/tours/:id')
//     .get(middleware, getTour) // even more selective middleware
//     .patch(patchTour)
//     .delete(deleteTour);
// App.get('/api/v1/tours', getAllTours);
// // handling variables in URL
// App.get('/api/v1/tours/:id', getTour);
// App.post('/api/v1/tours', postNewTour);
// App.patch('/api/v1/tours/:id', patchTour);
// App.delete('/api/v1/tours/:id', deleteTour);

const router = Router();
// ! params

// middleware that only triggers if this param is present ( same name )
router.param('id', (_req, _res, next, value) => {
  Logger.debug(`tour id is: ${value}`);
  next();
});

// validating param here instead of every subroute
// router.param('id', checkTourId);

// this below middleware can be used in the main app file before router in the use function when mounting
router.use(middleware); // middleware works on all routes

// router
//     .route('/')
//     .get(middlewareGet, getAllTours)
//     .post(
//         blockIfBodyIsEmpty,
//         blockIDInsertionMiddleware,
//         checkRequiredKeys.bind(['name', 'duration']),
//         validateAllKeys,
//         postNewTour
//     ); // middleware works on get route IMPORTANT: doesn't work for subroute get method

// router.use('/:id', middlewareSpecificSubResource); // middlware works on all :id route
// router
//     .route('/:id')
//     .get(middlewareSpecificSubResourceGetMethod, getTour) // middlware works on get :id route
//     .patch(
//         blockIDInsertionMiddleware,
//         blockIfBodyIsEmpty,
//         // checkTourId,
//         validateAllKeys,
//         patchTour
//     );
// .delete(checkTourId, deleteTour);

export { router as toursRouterV1 };
