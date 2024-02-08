const pathsToRoot = require('./pathToRoot');

module.exports = {
  extends: `${pathsToRoot.pathToRoot}babel.config.js`,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: true,
        },
        useBuiltIns: 'usage',
        corejs: '3.26', // ! STRING OR NUMBER?
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-transform-strict-mode'],
};
