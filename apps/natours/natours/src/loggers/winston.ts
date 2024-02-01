import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const environment = process.env.NODE_ENV || 'development';
  const isDevelopment = environment === 'development';
  return isDevelopment ? 'debug' : 'http';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.msZ' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    // (info) => `${info.timestamp} ${info.level}: ${info.message}`
    (info) =>
      `${info.timestamp}, ${info.component}, ${info.level}, ${info.message}`
  )
);
const formatJSON = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.msZ' }),
  // winston.format.colorize({ all: true }),
  winston.format.json()
  // winston.format.printf(
  //     // (info) => `${info.timestamp} ${info.level}: ${info.message}`
  //     (info) =>
  //         `${info.timestamp}, ${info.component}, ${info.level}, ${info.message}`
  // )
);

// const LEVEL = Symbol.for('http');
// function filterOnly(levelToFilter: string) {
//     return winston.format(function innerFunction(info) {
//         if (info[LEVEL] === levelToFilter) {
//             return info;
//         }
//     })();
// }
// filterOnly();

// handle main transports
const transportsCombinedDev = [new winston.transports.Console()];

const transportsCombinedProd = [
  // new winston.transports.Console(),
  ...transportsCombinedDev,

  // log errors in json
  new winston.transports.File({
    format: winston.format.combine(
      winston.format(function filterHttpOnly(info: any) {
        if (info[Symbol.for('level')] === 'error') {
          return info;
        }
        return false;
      })(),
      winston.format.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss.msZ',
      }),
      winston.format.json()
    ),
    filename: 'logs/error.log',
    level: 'error',
  }),

  // log http in json
  new winston.transports.File({
    format: winston.format.combine(
      winston.format(function filterHttpOnly(info: any) {
        if (info[Symbol.for('level')] === 'http') {
          return info;
        }
        return false;
      })(),
      winston.format.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss.msZ',
      }),
      winston.format.json()
    ),
    filename: 'logs/http.log',
    level: 'http',
  }),

  // log everything else in json but filter out http
  new winston.transports.File({
    filename: 'logs/all.log',
    format: winston.format.combine(
      winston.format(function filterHttpOnly(info: any) {
        if (
          info[Symbol.for('level')] === 'http'
          // ||
          // info[Symbol.for('level')] === 'error'
        ) {
          return false;
        }
        return info;
      })(),
      winston.format.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss.msZ',
      }),
      winston.format.json()
    ),
  }),
];

const transportsCombined =
  process.env.NODE_ENV === 'production'
    ? transportsCombinedProd
    : transportsCombinedDev;

// handle exceptions
const exceptionHandlersDev = [new winston.transports.Console()];

const exceptionHandlersProd = [
  ...exceptionHandlersDev,
  new winston.transports.File({
    filename: 'exceptions.log',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss.msZ',
      }),
      winston.format.json()
    ),
  }),
];

const exceptionHandlers =
  process.env.NODE_ENV === 'production'
    ? exceptionHandlersProd
    : exceptionHandlersDev;

const Logger = winston.createLogger({
  level: level(),
  defaultMeta: { component: 'combined' },
  levels,
  format,
  transports: transportsCombined,
  exceptionHandlers,
});

const JSONLogger = winston.createLogger({
  levels,
  level: level(),
  transports: transportsCombined,
  format: formatJSON,
});

export { JSONLogger, Logger };
