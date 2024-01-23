import { worker } from 'workerpool';

import { bullmqJob1 } from './job1.js';

export interface BullmqJobs {
  job1: typeof bullmqJob1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (...arguments_: any) => Promise<any>;
}

worker({
  job1: bullmqJob1,
});
