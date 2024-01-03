// .commitlintrc.js
const fs = require('node:fs');
const path = require('node:path');

const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));
const apps = fs.readdirSync(path.resolve(__dirname, 'apps'));
const libs = fs.readdirSync(path.resolve(__dirname, 'libs'));
module.exports = {
  rules: {
    'scope-enum': [2, 'always', [...packages, ...apps, ...libs]],
  },
  prompt: {
    useEmoji: true,
  },
};
