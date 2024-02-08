/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
import mongoose from 'mongoose';

import { server } from '../server';

let specServer: any;
(async () => {
  specServer = await server();
})();

// export const specServer = async () => {
//     return app;
// };

export const closeTestServer = async () => {
  specServer?.close();
  await mongoose.disconnect();
};
