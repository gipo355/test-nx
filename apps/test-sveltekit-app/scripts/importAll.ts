/**
 * ## FAILED ATTEMPT TO IMPORT ALL MODULES FROM A FOLDER AND ADD THEIR TYEPS TO FASTIFY INSTANCE
 * it works in javascript calling model.User.findById in the callback
 * but i lose all the types
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { TObject } from '@sinclair/typebox';
// const filename = fileURLToPath(import.meta.url);
// const dirname = path.dirname(filename);
import { glob } from 'glob';

// import { type UserModelType } from './plugins/mongo/models/User.js';

export const importAll = async (
  /**
   * @description
   * e.g. '${dirname}/pathTo/*.js'
   */
  relativePathWithGlobs: string,

  // callback: (exportedModule: TObject) => Promise<void>

  /**
   * @description
   * e.g. 'Schema', returns an object containing all exports having 'Schema' in the name
   */
  propertyNameToMatch: string
) => {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);

  const destinationPath = `${dirname}/${relativePathWithGlobs}`;

  console.log(
    `Importing all *${propertyNameToMatch}* exports from:`,
    destinationPath
  );

  const res = await glob(destinationPath);

  const modules: TObject<any>[] = await Promise.all(
    res.map(
      async (file) =>
        // console.log(file); // file path

        // import(file.replace(dirname, '.').replace('.js', ''))
        import(file)
    )
  );

  const schemas: Record<string, TObject<any>> = {};

  for (const module of modules) {
    // module.default();
    // module.hi();
    // console.log(module); // module object containing all exports, the default export is in module.default
    // named exports are in module.exportName

    // callback(module);
    // console.log(module.User);
    // console.log(typeof module.User);
    // schemas[module] = module;

    // Desired output: all module.PropertyName having "*Schema*" in the name must be added to schemas object
    // e.g. schemas = { todoSchema: todoSchema, userSchema: userSchema }
    // schemas[module.PropertyName] = module.PropertyName;

    for (const key of Object.keys(module)) {
      if (key.includes(propertyNameToMatch)) {
        schemas[key] = module[key];
      }
    }
  }

  // console.log('schemas', schemas);
  return schemas;
};

// EXAMPLES for testing

// const schemas = await importAll(`${dirname}/../src/lib/types/*.ts`, 'Schema');
// console.log('schemas', schemas);

// file:
// /home/wolf/Programming/git/COURSES/courses-pnpm-worktrees/courses-pnpm-dev/course_svelte/udemy_sveltekit/spotify/src/lib/types/spotifyQueryParams.ts
// /home/wolf/Programming/git/COURSES/courses-pnpm-worktrees/courses-pnpm-dev/course_svelte/udemy_sveltekit/spotify/src/lib/types/schemas.ts
// /home/wolf/Programming/git/COURSES/courses-pnpm-worktrees/courses-pnpm-dev/course_svelte/udemy_sveltekit/spotify/src/lib/types/nightwind.d.ts
// /home/wolf/Programming/git/COURSES/courses-pnpm-worktrees/courses-pnpm-dev/course_svelte/udemy_sveltekit/spotify/src/lib/types/index.ts
// /home/wolf/Programming/git/COURSES/courses-pnpm-worktrees/courses-pnpm-dev/course_svelte/udemy_sveltekit/spotify/src/lib/types/fastJson.ts
// /home/wolf/Programming/git/COURSES/courses-pnpm-worktrees/courses-pnpm-dev/course_svelte/udemy_sveltekit/spotify/src/lib/types/ajv.ts

// module:
// [Module: null prototype] {
//   default: {
//     type: 'object',
//     properties: {
//       response_type: [Object],
//       client_id: [Object],
//       scope: [Object],
//       redirect_uri: [Object],
//       state: [Object]
//     },
//     required: [ 'response_type', 'client_id', 'scope', 'redirect_uri', 'state' ],
//     [Symbol(TypeBox.Kind)]: 'Object'
//   },
//   spotifyQuerystringSchema: {
//     type: 'object',
//     properties: {
//       response_type: [Object],
//       client_id: [Object],
//       scope: [Object],
//       redirect_uri: [Object],
//       state: [Object]
//     },
//     required: [ 'response_type', 'client_id', 'scope', 'redirect_uri', 'state' ],
//     [Symbol(TypeBox.Kind)]: 'Object'
//   },
//   stringifySpotifyQuerystring: [Function: anonymous0]
// }

/**
 * ## e.g. how to use
 */

// void importAllModels(
//     `${dirname}/plugins/mongo/models/*.js`,
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     async (module) => {
//         console.log(module);
//         const user = await module.User.findById('60f0b0b3e1b0e3a6b0e3e0b3');
//         console.log(user);
//     }
// );
