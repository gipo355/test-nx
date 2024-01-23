module.exports = {
  extends: '../../.eslintrc.json',
  ignorePatterns: ['!**/*'],
  env: {
    node: true,
    browser: true,
  },
  parserOptions: {
    project: ['./tsconfig.*?.json'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.*?.json'],
        tsconfigRootDir: __dirname,
      },
    },
  },
};
