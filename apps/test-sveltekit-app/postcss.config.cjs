/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */

const path = require('node:path');

module.exports = {
  plugins: [
    require('postcss-nesting'),
    require('postcss-import'),
    require('tailwindcss')(path.join(__dirname, 'tailwind.config.cjs')),
    require('autoprefixer'), // built in svelte
    require('postcss-preset-env'),
  ],
};
