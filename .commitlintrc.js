// .commitlintrc.js
const fs = require('node:fs');
const path = require('node:path');

const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));
const apps = fs.readdirSync(path.resolve(__dirname, 'apps'));
const libs = fs.readdirSync(path.resolve(__dirname, 'libs'));

const { execSync } = require('child_process');

// @tip: git branch name = feature/issue_33   =>    auto get defaultIssues = #33
const issue = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim()
  .split('_')[1];

module.exports = {
  rules: {
    'scope-enum': [2, 'always', [...packages, ...apps, ...libs]],
  },
  prompt: {
    useEmoji: true,
    customIssuePrefixAlign: !issue ? 'top' : 'bottom',
    defaultIssues: !issue ? '' : `#${issue}`,
  },
};
