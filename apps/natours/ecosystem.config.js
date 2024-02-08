/* eslint-disable unicorn/no-empty-file */
/* eslint-disable unicorn/prefer-module */
// pm2 config
module.exports = {
  apps: [
    {
      name: 'natours-app',
      script: './main.js',
      // instances: -1,
      // instances: 'max',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        // NODE_ENV: 'development',
        NODE_ENV: 'production',
      },
      // env_production: {
      //     NODE_ENV: 'production',
      // },
      wait_ready: true,
      listen_timeout: 10_000,
      kill_timeout: 3000,
      max_memory_restart: '500M', // K, M, G for kilo mega giga
      exp_backoff_restart_delay: 100,
      // watch: true, // must stop with pm2 stop natours-app --watch
    },
    // {
    //     name: 'worker',
    //     script: 'worker.js',
    // },
    // {
    //     script: 'index.js',
    //     watch: '.',
    // },
    // {
    //     script: './service-worker/',
    //     watch: ['./service-worker'],
    // },
  ],

  // deploy: {
  //     production: {
  //         user: 'SSH_USERNAME',
  //         host: 'SSH_HOSTMACHINE',
  //         ref: 'origin/master',
  //         repo: 'GIT_REPOSITORY',
  //         path: 'DESTINATION_PATH',
  //         'pre-deploy-local': '',
  //         'post-deploy':
  //             'npm install && pm2 reload ecosystem.config.js --env production',
  //         'pre-setup': '',
  //     },
  // },
};
