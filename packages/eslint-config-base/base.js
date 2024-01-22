module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    extraFileExtensions: ['.svelte', '.astro', '.vue', '.html'],
  },
  plugins: [
    'tailwindcss',
    'import',
    'simple-import-sort',
    'html',
    '@html-eslint',
  ],
  extends: [
    'plugin:tailwindcss/recommended',
    'eslint:recommended',
    // 'airbnb-base',
    // 'plugin:import/recommended',
    'plugin:security/recommended',
    'plugin:unicorn/recommended',
    'plugin:lit/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.js', '*.mjs', '*.cjs'],
      extends: ['airbnb-base', 'prettier'],
    },
    {
      files: ['*.ts', '*.mts', '*.cts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/strict',
        'airbnb-base',
        'airbnb-typescript/base',
        'prettier',
      ],
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      rules: {
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: 'req|res|next|val|err',
          },
        ],

        '@typescript-eslint/prefer-for-of': 'warn',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-empty-function':
          process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        '@typescript-eslint/no-inferrable-types': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        //         // typescript specific
        '@typescript-eslint/require-await': 'warn', // fastify uses async functions for plugins which may not have await

        '@typescript-eslint/await-thenable': 'warn', // This rule disallows awaiting a function or value that is not a Promise. ON OVERRIDES
        // Warn if using a Promise without await/then/catch. Good to avoid running stuff in background non intentionally.
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-floating-promises.md
        '@typescript-eslint/no-floating-promises': 'warn', // This rule enforces Promises to have an error handler attached.
        // wasn't allowing eg setTimeout(async () =>...). Any good reason to keep it on? https://stackoverflow.com/a/63488201/10247962
        // this was off for possible conflicts
        '@typescript-eslint/no-misused-promises': 'warn', // This rule disallows passing a Promise to places that aren't designed to handle them, such as if-conditionals.
        '@typescript-eslint/promise-function-async': 'warn', // This rule enforces Promise-returning functions to be async.

        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          {
            allowString: true,
            allowNumber: false,
            allowNullableObject: true, // empty object and array is true.
            allowNullableBoolean: true,
            allowNullableString: true, // allow treating empty string as nullish
            allowNullableNumber: false, // don't allow treating 0 or nan as nullish
            allowNullableEnum: false,
            allowAny: false,
            allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
          },
        ],

        // activated those rules too late in the project. would be a massive work to fix for a course project
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-var-requires': 'off', // ! fixes import problems when using require
        '@typescript-eslint/restrict-template-expressions': 'warn', // prevents stringification in template literals of unstringable objects
        '@typescript-eslint/no-base-to-string': 'warn', // same as above
        '@typescript-eslint/no-unsafe-return': 'warn',
        // Wasn't simply allowing `const a = x.y.functionA`.
        '@typescript-eslint/unbound-method': 'warn',
        'no-unused-vars': 'off', // already have typescript rule
      },
    },
    {
      files: ['*.svelte'],
      extends: ['plugin:svelte/recommended', 'plugin:svelte/prettier'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    {
      files: ['*.tsx', '*.jsx'],
      plugins: ['react', 'react-hooks'],
      extends: ['airbnb', 'airbnb/hooks', 'plugin:react/recommended'],
      rules: {
        'react/display-name': 'off',
        'react/no-children-prop': 'off',
        'react/react-in-jsx-scope': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
      },
    },
    {
      files: ['*.tsx'],
      extends: ['airbnb-typescript'],
    },
    {
      files: ['*.html'],
      parser: '@html-eslint/parser',
      extends: ['plugin:@html-eslint/recommended'],
      rules: {
        '@html-eslint/indent': 'off',
        '@html-eslint/require-closing-tags': [
          'error',
          { selfClosing: 'always' },
        ],
        '@html-eslint/no-extra-spacing-attrs': [
          'error',
          { enforceBeforeSelfClose: true },
        ],
      },
    },
    {
      files: ['*.astro'],
      extends: ['plugin:astro/recommended'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      rules: {
        'react/jsx-filename-extension': [
          1,
          { extensions: ['.js', '.jsx', '.tsx', '.astro'] },
        ],
      },
    },
  ],
  rules: {
    'spaced-comment': 'warn',
    'class-methods-use-this': 'warn',
    'prefer-const': process.env.NODE_ENV === 'production' ? 'error' : 'warn', //! default on, useful at buildtime
    'no-empty': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-use-before-define': [
      'error',
      { functions: true, classes: true, variables: true },
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'sort-imports': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/order': 'off',
    'import/export': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    eqeqeq: 'error',
    'no-console': 'warn',
    'no-undef': 'warn',
    strict: 'error',
    'unicorn/filename-case': [
      'warn',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
          // "kebabCase": true
        },
      },
    ],
    'unicorn/no-null': 'off',
    'unicorn/no-array-for-each': 'warn',
    'unicorn/consistent-function-scoping': 'warn',
    'unicorn/prefer-module': 'warn',
    'unicorn/prevent-abbreviations': [
      'error',
      {
        replacements: {
          dev: false,
          prod: false,
          res: false,
          req: false,
          err: false,
          val: false,
          arr: false,
        },
      },
    ],
    'no-underscore-dangle': 'warn',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'warn',
    'import/no-extraneous-dependencies': 'off',
    complexity: ['error', 20],
    'consistent-return': 'warn',
    'no-useless-return': 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // ! ASYNCH RULES, FROM https://maximorlov.com/linting-rules-for-asynchronous-code-in-javascript/
    // check also parallelism in loops at https://maximorlov.com/parallel-tasks-with-pure-javascript/
    'no-async-promise-executor': 'warn', // This rule disallows passing an async function to the new Promise constructor.
    'no-await-in-loop': 'warn', // This rule disallows using await inside loops.
    'no-promise-executor-return': 'warn', // This rule disallows returning a value inside a Promise constructor.
    'require-atomic-updates': 'warn', // This rule disallows assignments in combination with await, which can lead to race conditions.
    'max-nested-callbacks': ['warn', 3], // This rule enforces a maximum nesting depth for callbacks. In other words, this rule prevents callback hell
    'no-return-await': 'warn', // This rule disallows unnecessary return await.
    'prefer-promise-reject-errors': 'warn', // This rule enforces using an Error object when rejecting a Promise.

    'no-implicit-coercion': 'warn', // This rule disallows shorthand type conversions for boolean, numbers and strings.

    // side effects and mutations (immutable and pure plugins)
    'no-var': 2,
    'no-void': [1, { allowAsStatement: true }],
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
  },
};
