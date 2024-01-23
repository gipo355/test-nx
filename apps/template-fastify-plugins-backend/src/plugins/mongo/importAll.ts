/**
 * ## FAILED ATTEMPT TO IMPORT ALL MODULES FROM A FOLDER AND ADD THEIR TYEPS TO FASTIFY INSTANCE
 * it works in javascript calling model.User.findById in the callback
 * but i lose all the types
 */
// import path from 'node:path';
// import { fileURLToPath } from 'node:url';
// const filename = fileURLToPath(import.meta.url);
// const dirname = path.dirname(filename);
import { glob } from 'glob';

// import { type UserModelType } from './plugins/mongo/models/User.js';

// const filename = fileURLToPath(import.meta.url);
// const dirname = path.dirname(filename);

export const importAllModels = async <Model>(
  /**
   * @description
   * e.g. '${dirname}/models/*.js'
   */
  relativePathWithGlobs: string,
  callback: (exportedModule: Model) => Promise<void>
) => {
  const res = await glob(relativePathWithGlobs);

  const modules: Model[] = await Promise.all(
    res.map(
      async (file) =>
        // import(file.replace(dirname, '.').replace('.js', ''))
        import(file)
    )
  );

  for (const module of modules) {
    // module.default();
    // module.hi();
    callback(module);
    // console.log(module.User);
    // console.log(typeof module.User);
  }
};

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
