import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Ajv from 'ajv';
import standaloneCode from 'ajv/dist/standalone';
import addFormats from 'ajv-formats';

// import { schemas } from '../src/lib/types/schemas';

import { importAll } from './importAll';

const compileAjv = async () => {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);

  const schemas = await importAll('../src/lib/types/*.ts', 'Schema');

  const keys = Object.keys(schemas).map((key) => key);

  if (keys.length === 0) {
    console.log('No schemas found!');
    return;
  }

  console.log('Compiling validation funcs for schemas:', keys);

  const ajv = addFormats(
    new Ajv({
      // here we pass all the schemas to compile for the validation
      schemas,
      code: {
        source: true,
        esm: true,
      },
    }),
    // add formats to validate
    [
      'date-time',
      'time',
      'date',
      'email',
      'hostname',
      'ipv4',
      'ipv6',
      'uri',
      'uri-reference',
      'uuid',
      'uri-template',
      'json-pointer',
      'relative-json-pointer',
      'regex',
    ]
  );

  const ajvFolder = path.join(dirname, '..', 'src/lib/validators/build');

  if (!existsSync(ajvFolder)) mkdirSync(ajvFolder, { recursive: true });

  const ajvPath = path.join(
    dirname,
    '..',
    'src/lib/validators/build/validate.js'
  );

  console.log('######### Preparing AJV standalone code...');

  const moduleCode = standaloneCode(ajv);

  console.log(`######### Writing Ajv functions to ${ajvPath}...`);

  const stream = createWriteStream(ajvPath);

  stream.write(moduleCode);
};

await compileAjv();
