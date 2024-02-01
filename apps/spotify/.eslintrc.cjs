module.exports = {
  extends: [
    '../../.eslintrc.json',
    '../../packages/eslint-config-base/storybook.js',
  ],
  ignorePatterns: ['!**/*'],
  env: {
    node: true,
    browser: true,
    es2024: true,
  },
  parserOptions: {
    // project: ['./tsconfig.*?.json'],
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        // project: ['./tsconfig.*?.json'],
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
  },
  rules: {
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
  },
};
