module.exports = {
  plugins: [
    // 'stylelint-scss'
    // 'stylelint-prettier'
  ],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    // "stylelint-config-prettier",
    'stylelint-config-recommended-scss',
    'stylelint-config-html',
    'stylelint-config-recommended-vue',
    'stylelint-config-idiomatic-order',
    'stylelint-config-prettier-scss',
    'stylelint-config-prettier',

    // 'stylelint-prettier/recommended', // enables plugin, enables rule, extends config-prettier
  ],
  // customSyntax,
  rules: {
    // 'prettier/prettier': true
    'no-empty-source': process.env.NODE_ENV === 'production' ? true : null,
    'selector-class-pattern': null,
  },
  overrides: [
    {
      files: [
        '*.ts',
        '*.tsx',
        '*.js',
        '*.jsx',
        '*.cjs',
        '*.mjs',
        '*.cts',
        '*.mts',
      ],
      customSyntax: 'postcss-lit',
    },
  ],
};
