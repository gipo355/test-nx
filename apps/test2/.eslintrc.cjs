module.exports = {
  extends: ['../../.eslintrc.json', '../../.eslintrc.base.json'],
  ignorePatterns: ['!**/*'],
  settings: {
    'import/resolver': {
      typescript: {
        project: ['apps/test-web/tsconfig.*?.json'],
      },
    },
  },
  parserOptions: {
    project: ['apps/test2/tsconfig.*?.json'],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
};
