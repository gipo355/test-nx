
      /// <reference types='vitest' />
      import { defineConfig } from 'vite';
      import { sveltekit } from '@sveltejs/kit/vite';
      import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
      
      export default defineConfig({
        cacheDir: '../../node_modules/.vite/testsveltekit',
        
    server:{
      port: 4200,
      host: 'localhost',
    },
        
    preview:{
      port: 4300,
      host: 'localhost',
    },
        
        plugins: [sveltekit(),
nxViteTsPaths()],
        
    // Uncomment this if you are using workers. 
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
        
        
        
      });