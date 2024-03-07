import { Value } from '@sinclair/typebox/value';

import { secretsSchema, type TSecrets } from './schemas/secrets';

// load all keys from process.env
// compare the keys with the keys from the schema with the Value
// objects must match
const o: Record<string, string | undefined> = {};

for (const key of Object.keys(secretsSchema.properties)) {
  o[key] = process.env[key];
}

const SECRETS = o as TSecrets;

// throws if the object does not match the schema, can't start the app
Value.Errors(secretsSchema, SECRETS);

export { SECRETS };
