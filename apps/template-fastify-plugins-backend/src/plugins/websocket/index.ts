import ws from '@fastify/websocket';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(ws, {
    // preClose: (wsDone) => {
    //     // eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-unsafe-assignment
    //     // Note: can also use async style, without done-callback
    //     const server = fastify.websocketServer;

    //     for (const connection of server.clients) {
    //         connection.close(
    //             1001,
    //             'WS server is going offline in custom manner, sending a code + message'
    //         );
    //     }

    //     server.close(wsDone);
    // },
    options: {
      maxPayload: 1_048_576,
      // verifyClient(info, next) {
      //     if (
      //         info.req.headers['x-fastify-header'] !==
      //         'fastify is awesome !'
      //     ) {
      //         return next(false); // the connection is not allowed
      //     }
      //     next(true); // the connection is allowed
      // },
    },
  });

  fastify.log.info('🌐 Websocket registered');
};

const websocket = fp(plugin, {
  name: 'websocket',
});

export default websocket;
