// import type {
// FastifyInstance,
// } from 'fastify';

// import type { AnimalModelType } from '../../db/mongo/models/Animal.js';

// declare module 'fastify' {
// export interface FastifyInstance<
//     HttpServer = Server,
//     HttpRequest = IncomingMessage,
//     HttpResponse = ServerResponse,
// > {
//     port: number;
// }
// export interface FastifyRequest {
// fastify: FastifyInstance | undefined | null; // NOT NEEDED, THIS POINTS TO FASTIFY INSTANCE ( DON'T USE ARROW FNS IN ROUTE HANDLERS )
// mongo: {
//     Animal: AnimalModelType;
// };
//         user: 'string';
//     }
// }

declare module 'fastify-mongodb-sanitizer';

declare module 'abstract-cache';
