// import { createReadStream } from 'node:fs';

import express from 'express';

// import filedb from '../assets/filedb.json';
// import { HOST, PORT } from './config';
import { Logger, morganLogger } from './loggers';
// import { workerPool1 } from './workers';

export const app = function app() {
  Logger.info('INIT APP');

  const expressApp = express();

  expressApp.use(morganLogger);

  // ! ROUTING
  // path, middleware, callback
  expressApp.get('/', (_request, response) => {
    // console.log(request, response);
    // const readableStream = createReadStream(filedb);
    // response.writeHead(200, {
    //     'set-cookie': 'mytest=2',
    // });
    // readableStream.pipe(response);

    // response.status(200).send({ ok: true });
    response.status(200).json({ ok: true });
  });

  expressApp.post('/', (_request, response) => {
    response.status(200).send('you can post here');
  });

  expressApp.get('/send', (_req, res) => {
    res.send('hello with send method');
  });

  // ! using workerpool
  // expressApp.get('/fibonacci', async (_request, response) => {
  //     // eslint-disable-next-line no-useless-catch
  //     const result = await workerPool1.exec('fibonacci', [20]);
  //     const hello = await workerPool1.exec('sayHello', []);
  //     Logger.info(workerPool1.stats());
  //     Logger.info(result);
  //     Logger.info(hello);
  //     // response.writeHead(200);
  //     response.send(`${result} ${hello}`);
  // });

  // ! handle 404
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  expressApp.use((_req, res, _next) => {
    res.status(404).send(`error: 404 not found ${_req.path}`);
  });

  // ! handle 500 exceptions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  expressApp.use((err: any, _req: any, res: any, _next: any) => {
    throw err.stack;
    res.status(500).send('error: 500 internal server error');
  });

  // // ! listen
  // expressApp.listen(PORT, HOST, () => {
  //     Logger.info(`app running and server listening @ ${HOST}:${PORT} ...`);
  // });
};
