import morgan from 'morgan';

import { Logger } from './winston';

export const morganLogger = morgan(
  process.env.NODE_ENV === 'production'
    ? ':remote-addr ; :method ; :url ; :status ; :res[content-length] ; :response-time ms ; :referrer'
    : 'dev',
  {
    stream: {
      write: (message: string) => Logger.http(message),
    },
  }
);
