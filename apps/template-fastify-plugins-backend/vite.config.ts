/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-default-export */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // globals: true,
    coverage: {
      provider: 'v8',
    },
    useAtomics: true,
    environment: 'node', // the default environment
    include: [
      // './dist/**/*.{test,spec,test.integration,spec.integration}.?(c|m)[t]s?(x)',
      // './test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      './dist/**/*.{test,spec,test.integration,spec.integration}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      './ui/**/*.{test,spec,test.integration,spec.integration}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    watchExclude: [
      '**/node_modules/**',
      // '**/dist/**',
      '**/src/**',
    ],
    exclude: [
      '**/node_modules/**',
      // '**/dist/**',
      '**/src/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
    passWithNoTests: true,
    reporters: [
      'hanging-process',
      // 'verbose',
      // 'tap',
      // 'dot',
      'default',
    ],
    globalSetup: [
      // './src/__tests__/globalSetup.ts',
      // './src/__tests__/setupServer.ts',
      './dist/test/globalSetup.js',
      './dist/test/setupServer.js',
    ],
    setupFiles: ['./dist/test/setupFile.js'],
    // sequence: {
    //     shuffle: true,
    // }
    // environmentMatchGlobs: [['src/**/*test.integration.ts', 'mongoose']], // Files to use mongoose environment
  },
});
