module.exports = {
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  jsxSingleQuote: true,
  semi: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  printWidth: 80,
  quoteProps: 'as-needed',
  bracketSameLine: false,
  proseWrap: 'always',
  endOfLine: 'lf',
  // plugins: [
  //   '@prettier/plugin-pug',
  //   'prettier-plugin-astro',
  //   'prettier-plugin-svelte',
  //   'prettier-plugin-tailwindcss',
  // ],
  // pluginSearchDirs: false,
  overrides: [
    // {
    //   files: '*.svelte',
    //   options: {
    //     parser: 'svelte',
    //     plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
    //   },
    // },
    {
      files: '*.css',
      options: {
        parser: 'css',
      },
    },
    {
      files: '*.html',
      options: {
        parser: 'html',
      },
    },
    // {
    //   files: '*.astro',
    //   options: {
    //     parser: 'astro',
    //   },
    // },
  ],
  tailwindFunctions: ['tw'],
};
