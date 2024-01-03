module.exports = {
  // 'package.json': 'syncpack format',
  '*.{css,scss,less,sass}': 'stylelint --fix --allow-empty-input',
  // '*.{json,yml,md,toml}': 'prettier --write',
  // '*.{yml,md,toml}': 'prettier --write',
  // TODO: eslint prettier broken
  '*.{yml,md,js,ts,tsx,svelte,astro,cjs,mjs,cts,mts,jsx,json,json5,.jsonc}':
    'prettier --write',
  // "**/*.ts?(x)": () => 'tsc --noEmit',
  // '**/*.{ts,tsx}': 'tsc-files --noEmit',
  // '*.{ts,tsx,js,jsx}': 'eslint --cache --fix --ext .js,.ts,.tsx,.jsx',
  '*.{ts,tsx,js,jsx,svelte,astro,cjs,mjs,cts,mts,vue}':
    'eslint --fix --ext .js,.ts,.tsx,.jsx,.svelte,.astro,.cjs,.mjs,.cts,.mts,.vue',
  // '*.{ts,tsx,js,jsx,json,json5,.jsonc}':
  // 'eslint --fix --ext .js,.ts,.tsx,.jsx,.json,.json5,.jsonc',
  // '*.{json,json5,jsonc}': 'eslint --cache --fix --ext .json,.json5,.jsonc',
  // '*.{ts,tsx,cts}': 'tsc-files --noEmit --pretty'
  // '**/*.ts': 'tsc --noEmit --pretty'
  '*.{html}': 'html-validate && htmlhint',
};
