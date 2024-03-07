import { Value } from '@sinclair/typebox/value';

import { secretsSchema, type TSecrets } from './schemas/secrets';

// load all keys from process.env
// compare the keys with the keys from the schema with the Value
// objects must match
const SECRETS: Record<string, string | undefined> = {} as TSecrets;

for (const key of Object.keys(secretsSchema.properties)) {
  SECRETS[key] = process.env[key];
}

// throws if the object does not match the schema, can't start the app
Value.Errors(secretsSchema, SECRETS);

export { SECRETS };
