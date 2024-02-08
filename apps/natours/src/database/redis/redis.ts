import IORedis from 'ioredis';

const {
  NATOUR_REDIS_USERNAME,
  NATOUR_REDIS_PASSWORD,
  // NATOUR_REDIS_CONNECTION_STRING: connectionStringSafe,
  NATOUR_REDIS_HOST,
  NATOUR_REDIS_PORT,
} = process.env;
if (!NATOUR_REDIS_USERNAME) throw new Error('NATOUR_REDIS_USERNAME not set');
if (!NATOUR_REDIS_PASSWORD) throw new Error('NATOUR_REDIS_PASSWORD not set');
if (!NATOUR_REDIS_HOST) throw new Error('NATOUR_REDIS_HOST not set');
if (!NATOUR_REDIS_PORT) throw new Error('NATOUR_REDIS_PORT not set');

const connection = {
  host: NATOUR_REDIS_HOST,
  password: NATOUR_REDIS_PASSWORD,
  port: Number(NATOUR_REDIS_PORT),
  username: NATOUR_REDIS_USERNAME,
  // eslint-disable-next-line unicorn/no-null
  maxRetriesPerRequest: null,
};

// const connectionString = connectionStringSafe
//     ?.replace('<username>', username as string)
//     .replace('<password>', password as string) as string;

// export const redisConnection = new IORedis(connectionString);
export const redisConnection = new IORedis(connection);
