import { type Static, Type } from '@sinclair/typebox';

export const secretsSchema = Type.Object({
  NATOURS_STRIPE_TEST_PUBLIC: Type.String(),
  NATOURS_STRIPE_TEST_SECRET: Type.String(),
  NATOURS_STRIPE_ENDPOINT_SECRET: Type.String(),
  NATOURS_STRIPE_ENDPOINT_SECRET_PROD: Type.String(),
  NATOUR_MONGO_CONNECTION_STRING: Type.String(),
  NATOUR_MONGO_PASSWORD: Type.String(),

  MAPBOX_PUBLIC_KEY: Type.String(),

  JWT_SECRET: Type.String(),
  JWT_EXPIRES_IN: Type.String(),
  COOKIE_PARSER_SECRET: Type.String(),
  CSRF_SECRET: Type.String(),

  PGUSER: Type.String(),
  PGHOST: Type.String(),
  PGPASSWORD: Type.String(),
  PGDATABASE: Type.String(),
  PGPORT: Type.String(),

  NATOUR_SENTRY_DSN: Type.String(),

  NODE_ENV: Type.String(),

  DEBUG: Type.Optional(Type.String()),
  UV_THREADPOOL_SIZE: Type.Optional(Type.String()),
});

export type TSecrets = Static<typeof secretsSchema>;
