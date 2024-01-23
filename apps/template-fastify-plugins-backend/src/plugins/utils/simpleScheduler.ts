import { AsyncTask, SimpleIntervalJob } from 'toad-scheduler';

const logFastifyStatsTask = new AsyncTask(
  'server-stats',
  async () => {
    // eslint-disable-next-line unicorn/no-array-reduce
    const memoryUsage = Object.entries(process.memoryUsage()).reduce(
      (accumulator, [key, value]) => {
        accumulator[key] = `${(value / 1_000_000).toFixed(2)}MB`;
        return accumulator;
      },
      {} as Record<string, string>
    );
    console.log(memoryUsage, 'memoryUsage');
  } //     (err) => {
  //         console.log(err);
  //         /* handle errors here */
  //     }
);

export const logFastifyStats = new SimpleIntervalJob(
  { seconds: 30 },
  logFastifyStatsTask
);
