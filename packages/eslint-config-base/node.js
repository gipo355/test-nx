module.exports = {
  extends: [
    'plugin:n/recommended',
    // 'plugin:security-node/recommended',
    // TODO:  migrate to new with flat eslint config
    'plugin:security/recommended',
  ],
  rules: {
    // 'n/no-missing-import': [
    //   'error',
    //   {
    //     // allowModules: [],
    //     // resolvePaths: ['/path/to/a/modules/directory'],
    //     tryExtensions: [
    //       '.js',
    //       '.cjs',
    //       '.mjs',
    //       '.json',
    //       '.ts',
    //       '.cts',
    //       '.mts',
    //       '.jsx',
    //       '.tsx',
    //       '.node',
    //     ],
    //   },
    // ],
    // 'unicorn/no-process-exit': 'off',
    // 'node/no-missing-import': 'off',
    // 'node/no-missing-import': [
    //     'error',
    //     {
    //         // allowModules: [],
    //         // resolvePaths: ['/path/to/a/modules/directory'],
    //         tryExtensions: ['.js', '.json', '.ts', '.jsx', '.tsx', '.node'],
    //     },
    // ],
    // 'unicorn/prefer-module': 'off', // with webpack __dirname is used when compiling to commonjs
    // from async suggestions at https://maximorlov.com/linting-rules-for-asynchronous-code-in-javascript/#1-no-async-promise-executor
    // 'node/no-sync': 'warn', // This rule disallows using synchronous methods from the Node.js core API where an asynchronous alternative exists.
    // 'node/handle-callback-err': 'warn', // This rule enforces error handling inside callbacks.
    // 'node/no-callback-literal': 'warn', // This rule enforces that a callback function is called with an Error object as the first parameter. In case there's no error, null or undefined are accepted as well.
    // '@typescript-eslint/no-explicit-any': 'off',
    // '@typescript-eslint/no-unsafe-assignment': 'off',
    // '@typescript-eslint/no-unsafe-member-access': 'off',
    // '@typescript-eslint/no-unsafe-call': 'off',
    // '@typescript-eslint/no-unsafe-argument': 'off',
    //
    // 'import/extensions': ['error', 'ignorePackages'],
    'import/no-unresolved': 'error',
    //
    // '@typescript-eslint/no-var-requires': 'off',
    // '@typescript-eslint/restrict-template-expressions': 'off',
    // '@typescript-eslint/no-unsafe-return': 'off',
    // 'spellcheck/spell-checker': 'off', // remove for this project, added midway
    // 'unicorn/no-abusive-eslint-disable': 'off',
    // 'prefer-arrow-callback': 'off',
    // '@typescript-eslint/strict-boolean-expressions': ['off'],
    // 'n/no-unpublished-import': 'off',
  },
};
