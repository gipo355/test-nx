/* eslint-disable import/no-default-export */
// import mongoose from 'mongoose';

import mongoose from 'mongoose';

// import { closeTestServer } from './specServer';

// import { specServer } from './specServer';

// import { server } from '../server';

export default async () => {
  // let app: any;
  // beforeAll(async () => {
  //     app = await server();
  // });
  // afterAll(async () => {
  //     app.close();
  //     // await mongoose.connection.close();
  //     await mongoose.disconnect();
  // });
  // specServer.close();
  await mongoose.disconnect();
  // app.close();
  // await closeTestServer();
};
