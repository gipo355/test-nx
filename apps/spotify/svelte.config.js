// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';
// import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess({})],

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    csp: {
      mode: 'auto',
      directives: {
        'default-src': ['self'],
        'script-src': ['strict-dynamic'],
        'style-src': ['self', 'https://fonts.googleapis.com'],
        'font-src': ['self', 'https://fonts.gstatic.com'],
        // 'upgrade-insecure-requests': true,
      },
      // reportOnly: {
      //     // 'script-src': ['self'],
      //     'report-to': ['csp-endpoint'],
      // },
    },
    alias: {
      // this will match a file
      // 'my-file': 'path/to/my-file.js',
      // this will match a directory and its contents
      // (`my-directory/x` resolves to `path/to/my-directory/x`)
      // 'my-directory': 'path/to/my-directory',
      // an alias ending /* will only match
      // the contents of a directory, not the directory itself
      // 'my-directory/*': 'path/to/my-directory/*'
      $app: './node_modules/@sveltejs/kit/src/runtime/app/',
      $lib: './src/lib/',
    },
  },
};

export default config;
