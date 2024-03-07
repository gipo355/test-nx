import {
  addColors,
  createLogger,
  format as winstonFormat,
  transports,
} from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const environment = process.env.NODE_ENV ?? 'development';
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

addColors(colors);

const format = winstonFormat.combine(
  winstonFormat.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.msZ' }),
  winstonFormat.colorize({ all: true }),
  winstonFormat.printf(
    (info) =>
      `${info.timestamp}, ${info.component}, ${info.level}, ${info.message}`
  )
);
const formatJSON = winstonFormat.combine(
  winstonFormat.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.msZ' }),
  winstonFormat.json()
);

const transportsCombinedDev = [new transports.Console()];

const transportsCombinedProd = [
  ...transportsCombinedDev,

  new transports.File({
    format: winstonFormat.combine(
      winstonFormat(function filterHttpOnly(info) {
        if (info[Symbol.for('level')] === 'error') {
          return info;
        }
        return false;
      })(),
      winstonFormat.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss.msZ',
      }),
      winstonFormat.json()
    ),
    filename: 'logs/error.log',
    level: 'error',
  }),

  new transports.File({
    format: winstonFormat.combine(
      winstonFormat(function filterHttpOnly(info) {
        if (info[Symbol.for('level')] === 'http') {
          return info;
        }
        return false;
      })(),
      winstonFormat.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss.msZ',
      }),
      winstonFormat.json()
    ),
    filename: 'logs/http.log',
    level: 'http',
  }),

  new transports.File({
    filename: 'logs/all.log',
    format: winstonFormat.combine(
      winstonFormat(function filterHttpOnly(info) {
        if (info[Symbol.for('level')] === 'http') {
          return false;
        }
        return info;
      })(),
      winstonFormat.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss.msZ',
      }),
      winstonFormat.json()
    ),
  }),
];

const transportsCombined =
  process.env.NODE_ENV === 'production'
    ? transportsCombinedProd
    : transportsCombinedDev;

const exceptionHandlersDev = [new transports.Console()];

const exceptionHandlersProd = [
  ...exceptionHandlersDev,
  new transports.File({
    filename: 'exceptions.log',
    format: winstonFormat.combine(
      winstonFormat.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss.msZ',
      }),
      winstonFormat.json()
    ),
  }),
];

const exceptionHandlers =
  process.env.NODE_ENV === 'production'
    ? exceptionHandlersProd
    : exceptionHandlersDev;

const Logger = createLogger({
  level: level(),
  defaultMeta: { component: 'combined' },
  levels,
  format,
  transports: transportsCombined,
  exceptionHandlers,
});

const JSONLogger = createLogger({
  levels,
  level: level(),
  transports: transportsCombined,
  format: formatJSON,
});

export { JSONLogger, Logger };
