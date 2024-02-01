/* eslint-disable unicorn/prefer-module */
const pathToRoot = require('./pathToRoot');

module.exports = {
  // plugins: ['security-node'],
  extends: [
    '../../packages/eslint-config-base/node.js',
    '../../.eslintrc.json',
    // 'plugin:node/recommended-module',
    // 'plugin:n/recommended',
    // // 'plugin:security-node/recommended',
  ],
  ignorePatterns: ['!**/*'],
  env: {
    node: true,
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.*?.json'],
        tsconfigRootDir: __dirname,
      },
    },
  },
  rules: {
    // old
    // 'node/no-missing-import': [
    //   'error',
    //   {
    //     // allowModules: [],
    //     // resolvePaths: ['/path/to/a/modules/directory'],
    //     tryExtensions: ['.js', '.json', '.ts', '.jsx', '.tsx', '.node'],
    //   },
    // ],
    // 'unicorn/prefer-module': 'off', // with webpack __dirname is used when compiling to commonjs
    // // from async suggestions at https://maximorlov.com/linting-rules-for-asynchronous-code-in-javascript/#1-no-async-promise-executor
    // 'node/no-sync': 'warn', // This rule disallows using synchronous methods from the Node.js core API where an asynchronous alternative exists.
    // 'node/handle-callback-err': 'warn', // This rule enforces error handling inside callbacks.
    // 'node/no-callback-literal': 'warn', // This rule enforces that a callback function is called with an Error object as the first parameter. In case there's no error, null or undefined are accepted as well.
    // '@typescript-eslint/no-explicit-any': 'off',
    // '@typescript-eslint/no-unsafe-assignment': 'off',
    // '@typescript-eslint/no-unsafe-member-access': 'off',
    // '@typescript-eslint/no-unsafe-call': 'off',
    // '@typescript-eslint/no-unsafe-argument': 'off',
    // '@typescript-eslint/no-var-requires': 'off',
    // '@typescript-eslint/restrict-template-expressions': 'off',
    // '@typescript-eslint/no-unsafe-return': 'off',
    // 'spellcheck/spell-checker': 'off', // remove for this project, added midway
    // 'unicorn/no-abusive-eslint-disable': 'off',
    // 'prefer-arrow-callback': 'off',
    // '@typescript-eslint/strict-boolean-expressions': ['off'],
  },
};
