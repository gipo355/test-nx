import {
  createWriteStream,
  existsSync,
  mkdirSync,
  // writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// import fastJson from 'fast-json-stringify';
// import { schemas } from '../src/lib/types/schemas';
import { importAll } from './importAll';
// import {
//   // writeFile,
//   appendFile,
// } from 'node:fs/promises';

const compileFastJsonStringify = async () => {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);

  const schemas = await importAll('../src/lib/types/*.ts', 'Schema');

  const keys = Object.keys(schemas).map((key) => key);

  if (keys.length === 0) {
    console.log('No schemas found!');
    return;
  }

  const folderName = 'serializers';

  console.log('Compiling stringify funcs for schemas:', keys);

  const stringifierFolder = path.join(
    dirname,
    '..',
    `src/lib/${folderName}/build`
  );

  if (!existsSync(stringifierFolder))
    mkdirSync(stringifierFolder, { recursive: true });

  const stringifierPath = path.join(
    dirname,
    '..',
    `src/lib/${folderName}/build/stringify.js`
  );

  console.log('######### Preparing FastJsonStringify standalone code...');

  const codes = Object.entries(schemas).map(
    ([key, value]) =>
      `\nexport const stringify${
        key.at(0).toUpperCase() + key.slice(1)
      } = fastJson(${JSON.stringify(value)})\n`
  );

  const moduleCode = `import fastJson from 'fast-json-stringify';\n ${codes.join(
    ''
  )}`;

  // method 2, standalone not working because it emits cjs
  // writeFileSync(path.join(stringifierFolder, 'index.js'), ``);

  // await Promise.all(
  //   Object.entries(schemas).map(async ([key, value]) => {
  //     const stringifierPath = path.join(
  //       dirname,
  //       '..',
  //       `src/lib/${folderName}/build/stringify${
  //         key.at(0).toUpperCase() + key.slice(1)
  //       }.js`
  //     );
  //     const stream = createWriteStream(stringifierPath);
  //     const code = fastJson(value, { mode: 'standalone' });
  //     // await appendFile(
  //     //   path.join(stringifierFolder, 'index.js'),
  //     //   `export * from './${key}.js';\n`
  //     // );
  //     stream.write(code);
  //   })
  // );

  console.log(
    // `######### Writing FastJsonStringify functions to ${stringifierPath}...`
    `######### Writing FastJsonStringify functions to ${stringifierFolder}...`
  );

  const stream = createWriteStream(stringifierPath);

  stream.write(moduleCode);
};

await compileFastJsonStringify();
