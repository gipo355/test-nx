/* eslint-disable import/no-extraneous-dependencies */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { partytownVite } from '@builder.io/partytown/utils';
// import path from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
// import react from '@vitejs/plugin-react';
// import vue from '@vitejs/plugin-vue';
// import vueJsx from '@vitejs/plugin-vue-jsx';
// import autoprefixer from 'autoprefixer';
// import postcssImport from 'postcss-import';
// import postcssNesting from 'postcss-nesting';
// import postcssPresetEnv from 'postcss-preset-env';
// import tailwindcss from 'tailwindcss';
// import { defineConfig } from 'vite';
// import postcssModules from "postcss-modules";
import { imagetools } from 'vite-imagetools';
// import checker from 'vite-plugin-checker';
// import checker from 'vite-plugin-checker';
// import { createHtmlPlugin } from 'vite-plugin-html';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
// import mpa from 'vite-plugin-mpa';
// import { VitePWA } from 'vite-plugin-pwa';
// import Sitemap from 'vite-plugin-sitemap';
// import webfontDownload from 'vite-plugin-webfont-dl';
// import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// export default defineConfig((configEnv) => ({
export default defineConfig(() => ({
  root: __dirname,
  build: {
    outDir: '../../dist/apps/test-sveltekit-app',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  // root: "",
  // base: "/",
  // mode: "development",

  // https://github.com/vitejs/awesome-vite#plugins
  // https://vitejs.dev/plugins/
  plugins: [
    sveltekit(),
    Icons({
      autoInstall: true,
      compiler: 'svelte',
    }),
    partytownVite({
      dest: path.resolve(dirname, 'build/~partytown'),
    }),
    ViteImageOptimizer({}),
    // checker({
    //     typescript: true,
    //     eslint: {
    //         lintCommand: 'eslint "./src/**/*.{ts,tsx, js, jsx, svelte}"',
    //     },
    //     stylelint: {
    //         lintCommand: 'stylelint ./src/**/*.{css,vue,scss,svelte}',
    //     },
    // }),
    // webfontDownload(),
    imagetools(),
  ],

  server: {
    host: '127.0.0.1',
  },

  // https://vitejs.dev/guide/features.html
  // build: {
  //     //   cssMinify: "lightningcss",
  //     rollupOptions: {
  //         input: {
  //             main: resolve(__dirname, 'index.html'),
  //             accordion: resolve(__dirname, 'accordion.html'),
  //             carousel: resolve(__dirname, 'carousel.html'),
  //         },
  //     },
  // },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "$lib/styles/modules/utils/functions";
          @use "$lib/styles/modules/variables";
          @use "$lib/styles/modules/utils/breakpoint";
          `,
      },
    },
    // // 	// 	// VITE has built in postcss plugins ( only nesting was needed i think )
    // // 	postcss: {
    // // 		plugins: [
    // // 			postcssNesting,
    // // 			postcssImport(),
    // // 			// tailwindcss(path.join(__dirname, 'tailwind.config.cjs')),
    // // 			postcssPresetEnv
    // // // 			// autoprefixer // built in preset env
    // // // 			// postcssModules,
    // // 		]
    // // 	}
    // // 	// 	// modules: {
    // // 	// 	// 	generateScopedName: mode === 'production' ? '[hash:base64:8]' : '[local]_[hash:base64:5]',
    // // 	// 	// 	localsConvention: 'camelCase'
    // // 	// 	// }
  },
  test: {
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/test-sveltekit-app',
      provider: 'v8',
    },
    include: ['src/**/*.{test,spec}.{js,ts}'],
    // coverage: {
    //   provider: 'v8',
    // },
  },
}));
