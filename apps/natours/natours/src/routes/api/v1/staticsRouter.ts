// import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { Request, Response } from 'express';
import { Router, static as expStatic } from 'express';
import swaggerUi from 'swagger-ui-express';

// import adminPage from '../../../../assets/public/admin.html';
import {
  // IS_DEP_CRUISER_ENABLED,
  IS_SWAGGER_SERVER_ENABLED,
  // IS_TYPEDOC_SERVER_ENABLED,
} from '../../../config';
// eslint-disable-next-line node/no-unpublished-import
// import depGraph from '../../../docs/dependency-graph.svg';
// eslint-disable-next-line node/no-unpublished-import
// import swaggerJSON from '../../../docs/swagger-output.json';
// eslint-disable-next-line node/no-unpublished-import, node/no-missing-import
import swaggerSpecJson from '../../../docs/swagger-output.json';
import { Logger } from '../../../loggers';

const router = Router();

/**
 * ## Public folder
 */
// BUG: doesn't work after adding pug to webpack with htmlwebpackplugin since #dc8019?
// no public, can't find on this server
// router.use('/', expStatic(path.join(__dirname, 'public')));
router.use('/public', expStatic(path.join(__dirname, 'public')));

/**
 * ## Admin page - because of PUG
 * added admin route in addition to static file /admin.html served in the  global middleware
 */
// router.get('/admin', (_req: Request, res: Response) => {
//     // res.status(200).sendFile(`${__dirname}/public/admin.html`);
//     // res.status(200).sendFile(path.join(__dirname, 'public', 'admin.html'));
//     // console.log(adminPage);
//     /**
//      * ## we use html-loader to import the html file as a string and then we can send it as a response instead of rendering it with pug
//      * it's basically the same as render. pug exports a function that takes a template and returns a string which gets rendered to html
//      */
//     res.status(200).send(adminPage);
// });

/**
 * ## Typedocs
 */
// typedocs
// eslint-disable-next-line unicorn/prefer-module
// if (IS_TYPEDOC_SERVER_ENABLED) {
//     // TODO: modify endpoint for typedoc ( currently index.html )
//     // eslint-disable-next-line unicorn/prefer-module
//     router.use('/typedoc', expStatic(`${__dirname}/typedoc`));
//     Logger.info('Typedoc server enabled on /typedoc');
// }

/**
 * ## Dependency cruiser
 */
// dependency graph with dependency-cruiser
// if (IS_DEP_CRUISER_ENABLED) {
//     // router.use('/dependency-graph', expStatic(`${__dirname}${depGraph}}`));
//     router.use('/dependency-graph', (_req: Request, res: Response) => {
//         // res.status(200).sendFile(`${__dirname}/assets/dependency-graph.svg`);
//         res.status(200).sendFile(`${__dirname}/${depGraph}`);
//     });
//     Logger.info(`dep graph enabled on /dependency-graph`);
// }

/**
 * ## SWAGGER DOCS
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (IS_SWAGGER_SERVER_ENABLED) {
  // TODO: problem with apis paths. won't read the route files
  if (false) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { swaggerSpec } = await import('../../../docs/swagger');

    router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    router.get('/docs.json', (_req: Request, res: Response) => {
      res.status(200).json(swaggerSpec);
    });
    Logger.info(`Swagger docs enabled on /docs, /docs.json endpoint`);
  } else if (swaggerSpecJson) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    // const swaggerJSON = await import('./docs/swagger-output.json');
    /**
     * this block of code is only used if i generate a separate json file from swagger-jsdoc
     */
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    // const swaggerSpecJson = await readFile(swaggerJSON, 'utf8'); // either generate with webpack or with an npm script

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    // const swaggerSpecJson = await readFile(
    //   // eslint-disable-next-line unicorn/prefer-module
    //   `${__dirname}/assets/swagger-output.json`,
    //   'utf8'
    // ); // either generate with webpack or with an npm script
    // eslint-disable-next-line no-lonely-if
    // if (swaggerSpecJson) {
    // const swaggerSpecJson = await readFile(`${__dirname}/swagger.json`, 'utf8'); // either generate with webpack or with an npm script
    // const swaggerSpec = JSON.parse(swaggerSpecJson);
    const swaggerSpec = swaggerSpecJson;
    // console.log(swaggerJson);
    router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    // docs in json format
    router.get('/docs.json', (_req: Request, res: Response) => {
      res.status(200).json(swaggerSpec);
    });
    // Logger.info(`Swagger docs enabled on /docs, /docs.json endpoint`);
    Logger.info(`Swagger docs enabled on /docs, /docs.json endpoint`);
  } else {
    Logger.error('generate swagger json file!');
    // }
  }

  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  // const { swaggerSpec } = await import('./docs/swagger');
  // console.log(swaggerSpec);

  // App.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // App.get('/docs.json', (_req: Request, res: Response) => {
  //     res.status(200).json(swaggerSpec);
  // });
}

export { router as staticsRouter };
