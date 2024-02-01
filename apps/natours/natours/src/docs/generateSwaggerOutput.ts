import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import { swaggerSpec } from './swagger';

// eslint-disable-next-line security/detect-non-literal-fs-filename
writeFile(
  // eslint-disable-next-line unicorn/prefer-module
  path.join(__dirname, 'swagger-output.json'),
  JSON.stringify(swaggerSpec),
  'utf8'
  // eslint-disable-next-line unicorn/prefer-top-level-await, no-console
).catch((error) => console.error(error));
