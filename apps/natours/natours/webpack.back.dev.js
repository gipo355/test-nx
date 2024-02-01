/* eslint-disable security/detect-non-literal-require */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
// ! loads
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const SwaggerJSDocWebpackPlugin = require('swagger-jsdoc-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');

// const Dotenv = require('dotenv-webpack');

const path = require('node:path');
const { merge } = require('webpack-merge');
const glob = require('glob');
const pathsToRoot = require('./pathToRoot');

const webpackBack = require(`${pathsToRoot.pathToRoot}webpack.back.dev.js`);

// eslint-disable-next-line import/extensions
// const swaggerConfig = require('./swagger.config.js');

// entry point for testing
let entry = {
  main: ['./src/main.ts'],
  bullmqWorkerInPool: './src/workers/bullmqWorkerInPool.ts',
  worker1: './src/workers/worker1.ts',
  imageWorker: './src/workers/imageWorker.ts',
  web: {
    import: './src/views/js/main.ts',
    // filename: 'public/js/[name].[contenthash].bundle.js',
    filename: 'public/js/[name].[contenthash].bundle.js',
  },
};

if (process.env.TESTBUILD) {
  entry = {
    main: glob.sync(`${__dirname}/src/__tests__/**/*.spec.ts`),
    // bullmqWorkerInPool: './src/workers/bullmqWorkerInPool.ts',
    // worker1: './src/workers/worker1.ts',

    /**
     * ## WE MUST ADD FILENAME, WE DON'T WANT THEM TO BE CALLED SPEC OR IT WILL PASS ERROR
     * only spec files must be outputted .spec.js
     * this overrides the output name
     */
    bullmqWorkerInPool: {
      import: './src/workers/bullmqWorkerInPool.ts',
      filename: '[name].js',
    },
    worker1: { import: './src/workers/worker1.ts', filename: '[name].js' },
    imageWorker: {
      import: './src/workers/imageWorker.ts',
      filename: '[name].js',
    },
    web: {
      import: './src/views/js/main.ts',
      // filename: 'public/js/[name].[contenthash].bundle.js',
      filename: 'public/js/[name].[contenthash].bundle.js',
    },
  };
}
let output = {
  // filename: "[name].[contenthash].bundle.js",
  filename: '[name].js',
  path: path.resolve(__dirname, 'dist'),
  // * export assets loaded with html loader into path
  // assetModuleFilename: 'assets/[name].[contenthash][ext][query]',
  assetModuleFilename: 'assets/[name][ext][query]',

  /*
   * this public path is needed to inject into the pug/html file with /root and avoid relative path
   * but it will change all assets path to /asset-path, breaking lines where i'm using the path to them
   */
  // publicPath: 'auto',
  publicPath: '/',
  // publicPath: '/public/',
};
if (process.env.TESTBUILD) {
  output = {
    filename: '[name].spec.js',
    path: path.resolve(__dirname, 'test-dist'),
    // * export assets loaded with html loader into path
    // assetModuleFilename: 'assets/[name].[contenthash][ext][query]',
    assetModuleFilename: 'assets/[name][ext][query]',

    /*
     * this public path is needed to inject into the pug/html file with /root and avoid relative path
     */
    publicPath: '/',
    // publicPath: '/public/',
  };
}
module.exports = [
  merge(
    webpackBack,
    {
      //

      // ! entry #region [ 4 ]
      // entry: {
      //     main: ['./src/main.ts'],
      //     bullmqWorkerInPool: './src/workers/bullmqWorkerInPool.ts',
      //     worker1: './src/workers/worker1.ts',
      // },
      entry,

      plugins: [
        // # This file is used to set environment variables for the frontend environment
        // # all the envs listed in .front.env will be replace the process.env values during the build process
        // # the values are REQUIRED to be in the .front.env: infisical won't inject them unless if
        // # i use the command before the build `pnpm cmd`
        // # pnpm dev won't work: it needs `infisical run - pnpm dev` if you want to set them in infisical
        // new Dotenv({
        //     path: './.front.env', // load this now instead of the ones in '.env'
        //     safe: './.front.env.example', // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
        //     allowEmptyValues: false, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
        //     systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
        //     silent: false, // hide any errors
        //     defaults: false, // load '.env.defaults' as the default values if empty.
        //     // prefix: 'import.meta.env.', // reference your env variables as 'import.meta.env.ENV_VAR'.
        // }),
        /**
         * ## needed to move this here from main webpack ( if multi config, it was deleting the second one )
         */
        new CleanWebpackPlugin(),
        new CopyPlugin({
          patterns: [
            //         { from: './package.json' },
            //         // { from: './assets/copy', to: './copy' },
            //         // { from: "./src/assets", to: "./assets" },
            { from: './src/public/', to: './public/' },
            // { from: './src/docs/typedoc', to: './typedoc/' },
            // { from: './src/workers/worker1.js', to: './workers/' },
            // { from: './src/workers/worker1.js' },
            // { from: './src/messageBrokers/emailWorker.js' },
            { from: './dev-certs/', to: './certs' },
            // { from: './src/views', to: './views' },
            { from: './src/views/emails', to: './emails' },
          ],
        }),
        // new SwaggerJSDocWebpackPlugin(swaggerConfig),
        new MiniCssExtractPlugin({
          filename: 'public/css/[name].[contenthash].css',
        }),

        new HtmlWebpackPlugin({
          template: './src/views/base.pug',
          // filename: 'views/base.pug',
          filename: 'base.pug',
          chunks: ['web'],
          inject: 'head',
          minify: false,
        }),
        new HtmlWebpackPlugin({
          template: './src/views/base-test.pug',
          filename: 'base-test.pug',
          // filename: 'views/base-test.pug',
          chunks: ['web'],
          inject: 'head',
          minify: false,
        }),
        new HtmlWebpackPlugin({
          template: './src/views/_footer.pug',
          filename: '_footer.pug',
          // filename: 'views/_footer.pug',
          chunks: ['web'],
          inject: 'head',
          minify: false,
        }),
        new HtmlWebpackPlugin({
          template: './src/views/_header.pug',
          // filename: 'views/_header.pug',
          filename: '_header.pug',
          chunks: ['web'],
          inject: 'head',
          minify: false,
        }),
        new HtmlWebpackPlugin({
          template: './src/views/overview.pug',
          // filename: 'views/overview.pug',
          filename: 'overview.pug',
          chunks: ['web'],
          inject: 'head',
          minify: false,
        }),
        new HtmlWebpackPlugin({
          template: './src/views/login.pug',
          // filename: 'views/login.pug',
          filename: 'login.pug',
          chunks: ['web'],
          inject: 'head',
          minify: false,
        }),
        new HtmlWebpackPlugin({
          template: './src/views/signup.pug',
          filename: 'signup.pug',
          // filename: 'views/signup.pug',
          chunks: ['web'],
          inject: 'head',
          minify: false,
        }),
        new HtmlWebpackPlugin({
          template: './src/views/tour.pug',
          // filename: 'views/tour.pug',
          filename: 'tour.pug',
          chunks: ['web'],
          inject: 'head',
          minify: false,
        }),
        new HtmlWebpackPlugin({
          template: './src/views/error.pug',
          // filename: 'views/tour.pug',
          filename: 'error.pug',
          chunks: ['web'],
          inject: 'head',
          minify: false,
        }),
        new HtmlWebpackPlugin({
          template: './src/views/account.pug',
          // filename: 'views/tour.pug',
          filename: 'account.pug',
          chunks: ['web'],
          inject: 'head',
          minify: false,
        }),
        new HtmlWebpackPugPlugin({
          adjustIndent: true,
        }),
      ].filter(Boolean),

      // module: {
      //   rules: [
      //     {
      //       test: /\.(sass|css|scss)$/,
      //       use: [
      //         MiniCssExtractPlugin.loader,
      //         //   "style-loader", //3. Inject styles into DOM
      //         {
      //           loader: 'css-loader',
      //           options: {
      //             importLoaders: 1,
      //             modules: {
      //               auto: true,
      //               localIdentName: '[hash:base64:5]',
      //             },
      //           },
      //         },
      //         {
      //           loader: 'postcss-loader',
      //           options: {
      //             postcssOptions: {
      //               config: path.resolve(__dirname, 'postcss.dev.js'),
      //             },
      //           },
      //         },
      //         'sass-loader',
      //       ],
      //       // include: /\.module\.(s?css)$/,
      //     },
      //   ],
      // },

      // ! output
      // output: {
      //     path: path.resolve(__dirname, 'dist'),
      // }, // #endregion
      output,
    } // #endregion
  ),
  // merge(
  //   webpackBack,
  //   {
  //     //

  //     // ! entry #region [ 4 ]
  //     // entry: {
  //     //     main: ['./src/main.ts'],
  //     //     bullmqWorkerInPool: './src/workers/bullmqWorkerInPool.ts',
  //     //     worker1: './src/workers/worker1.ts',
  //     // },
  //     entry: {
  //       web: {
  //         import: './src/views/js/main.ts',
  //         // filename: 'public/js/[name].[contenthash].bundle.js',
  //         filename: 'public/js/[name].[contenthash].bundle.js',
  //       },
  //     },

  //     plugins: [
  //       // new CopyPlugin({
  //       //   patterns: [
  //       //     //         { from: './package.json' },
  //       //     //         // { from: './assets/copy', to: './copy' },
  //       //     //         // { from: "./src/assets", to: "./assets" },
  //       //     { from: './src/public/', to: './public/' },
  //       //     // { from: './src/docs/typedoc', to: './typedoc/' },
  //       //     // { from: './src/workers/worker1.js', to: './workers/' },
  //       //     // { from: './src/workers/worker1.js' },
  //       //     // { from: './src/messageBrokers/emailWorker.js' },
  //       //     { from: './dev-certs/', to: './certs' },
  //       //     // { from: './src/views', to: './views' },
  //       //   ],
  //       // }),
  //       // new SwaggerJSDocWebpackPlugin(swaggerConfig),
  //       new MiniCssExtractPlugin({
  //         filename: 'public/css/[name].[contenthash].css',
  //       }),

  //       new HtmlWebpackPlugin({
  //         template: './src/views/base.pug',
  //         // filename: 'views/base.pug',
  //         filename: 'base.pug',
  //         chunks: ['web'],
  //         inject: 'head',
  //         minify: false,
  //       }),
  //       new HtmlWebpackPlugin({
  //         template: './src/views/base-test.pug',
  //         filename: 'base-test.pug',
  //         // filename: 'views/base-test.pug',
  //         chunks: ['web'],
  //         inject: 'head',
  //         minify: false,
  //       }),
  //       new HtmlWebpackPlugin({
  //         template: './src/views/_footer.pug',
  //         filename: '_footer.pug',
  //         // filename: 'views/_footer.pug',
  //         chunks: ['web'],
  //         inject: 'head',
  //         minify: false,
  //       }),
  //       new HtmlWebpackPlugin({
  //         template: './src/views/_header.pug',
  //         // filename: 'views/_header.pug',
  //         filename: '_header.pug',
  //         chunks: ['web'],
  //         inject: 'head',
  //         minify: false,
  //       }),
  //       new HtmlWebpackPlugin({
  //         template: './src/views/overview.pug',
  //         // filename: 'views/overview.pug',
  //         filename: 'overview.pug',
  //         chunks: ['web'],
  //         inject: 'head',
  //         minify: false,
  //       }),
  //       new HtmlWebpackPlugin({
  //         template: './src/views/login.pug',
  //         // filename: 'views/login.pug',
  //         filename: 'login.pug',
  //         chunks: ['web'],
  //         inject: 'head',
  //         minify: false,
  //       }),
  //       new HtmlWebpackPlugin({
  //         template: './src/views/signup.pug',
  //         filename: 'signup.pug',
  //         // filename: 'views/signup.pug',
  //         chunks: ['web'],
  //         inject: 'head',
  //         minify: false,
  //       }),
  //       new HtmlWebpackPlugin({
  //         template: './src/views/tour.pug',
  //         // filename: 'views/tour.pug',
  //         filename: 'tour.pug',
  //         chunks: ['web'],
  //         inject: 'head',
  //         minify: false,
  //       }),
  //       new HtmlWebpackPugPlugin({
  //         adjustIndent: true,
  //       }),
  //     ].filter(Boolean),

  //     // module: {
  //     //   rules: [
  //     //     {
  //     //       test: /\.(sass|css|scss)$/,
  //     //       use: [
  //     //         MiniCssExtractPlugin.loader,
  //     //         //   "style-loader", //3. Inject styles into DOM
  //     //         {
  //     //           loader: 'css-loader',
  //     //           options: {
  //     //             importLoaders: 1,
  //     //             modules: {
  //     //               auto: true,
  //     //               localIdentName: '[hash:base64:5]',
  //     //             },
  //     //           },
  //     //         },
  //     //         {
  //     //           loader: 'postcss-loader',
  //     //           options: {
  //     //             postcssOptions: {
  //     //               config: path.resolve(__dirname, 'postcss.dev.js'),
  //     //             },
  //     //           },
  //     //         },
  //     //         'sass-loader',
  //     //       ],
  //     //       // include: /\.module\.(s?css)$/,
  //     //     },
  //     //   ],
  //     // },

  //     // ! output
  //     // output: {
  //     //     path: path.resolve(__dirname, 'dist'),
  //     // }, // #endregion
  //     output: { ...output, publicPath: '/' },
  //   } // #endregion
  // ),
];
