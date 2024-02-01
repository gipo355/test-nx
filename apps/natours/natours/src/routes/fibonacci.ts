export {};
console.log('init');
// import { App } from '../app';
// import { Logger } from '../loggers';
// import { workerPool1 } from '../workers/workerPools'; // for some reason barreling doesn't work

// export const handleFibonacciRoute = function fibonacci() {
//     // ! using workerpool
//     App.get('/fibonacci', async (_request, response) => {
//         // eslint-disable-next-line no-useless-catch
//         const result = await workerPool1.exec('fibonacci', [20]);
//         const hello = await workerPool1.exec('sayHello', []);
//         Logger.info(workerPool1.stats());
//         Logger.info(result);
//         Logger.info(hello);
//         // // response.writeHead(200);
//         response.status(200).send(`${result} ${hello}`);
//     });
// };
