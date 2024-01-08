/* eslint-disable spellcheck/spell-checker */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable unicorn/prefer-module */
// ! loads
// const { resolve } = require('node:path');
const path = require('node:path');
// const pathsToRoot = require( './pathToRoot' );

// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const JsonMinimizerPlugin = require('json-minimizer-webpack-plugin');

// common and merge only if sharing a common config file
// const common = require("./webpack.common");
// const { merge } = require("webpack-merge");

// var HtmlWebpackPlugin = require( "html-webpack-plugin" );
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CssMinimizerPlugin = require( "css-minimizer-webpack-plugin" );
// const FaviconsWebpackPlugin = require( "favicons-webpack-plugin" );

// * sitemap and robots
// const SitemapPlugin = require( "sitemap-webpack-plugin" ).default;
// define website paths for sitemap generator
// const paths = [ "/about/", "/contacts/", "/services/" ];

// * typescript
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// * eslint
const ESLintPlugin = require('eslint-webpack-plugin');

// * externals
const nodeExternals = require('webpack-node-externals');

// const fs = require( "fs" );
// const nodeModules = {};
// fs.readdirSync( '../../node_modules' )
//   .filter( function ( x ) {
//     return [ '.bin' ].indexOf( x ) === -1;
//   } )
//   .forEach( function ( mod ) {
//     nodeModules[ mod ] = 'commonjs ' + mod;
//   } );

// tsconfig paths
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  //

  // ! entry #region [ 4 ]
  // entry: {
  // index: [ "./src/index.ts" ],
  // index: [ "./src/index.ts" ],
  // vendor: "./src/vendor.ts",
  // * MULTI PAGE SETUP, ADD WHAT NEEDS TO BE INJECTED TO PAGE THEN GO BELOW ON HTMLWEBPACKPLUGIN
  // about: ["./src/about.ts"],
  // },

  // ! output
  output: {
    // filename: "[name].[contenthash].bundle.js",
    filename: '[name].js',
    // path: path.resolve( __dirname, "dist" ),
    // * export assets loaded with html loader into path
    // assetModuleFilename: 'assets/[name].[contenthash][ext][query]',
    assetModuleFilename: 'assets/[name][ext][query]',
  }, // #endregion

  // ! new feature
  experiments: {
    topLevelAwait: true,
  },

  //   !configs
  mode: 'production',
  // devtool: 'source-map',
  // devtool: "source-map",
  devtool: process.env.DEBUG ? 'source-map' : false,
  // config to make live reload of dev server work
  //   devServer: {
  //     hot: false,
  //     liveReload: true,
  //   },

  //  ! plugins #region [4]
  // * multi page setup
  plugins: [
    // new HtmlWebpackPlugin( {
    //   template: "./src/index.html",
    //   // * favicon not needed if using faviconswebpackplugin
    //   // favicon: "./src/assets/favicon.ico",
    //   // * chunks allow injecting separate entry points as different script bundles per page
    //   chunks: [ "common" ],
    //   // inject: "body",
    //   // * add meta tags that could be page specific or could change with every build, or copywebpack plugin - can we use the favicon generators?
    //   // * direct links to assets get compiled, this isn't needed
    //   // meta: {
    //   //   'description': { name: 'description', contnet: '...' },
    //   //   'keyword': { name: 'keywords', content: '...' },
    //   //   'og:title': { property: 'og:title', content: '...' },
    //   //   'og:description': { property: 'og:description', content: '...' },
    //   //   'og:type': { property: 'og:type', content: 'website' },
    //   //   'og:url': { property: 'og:url', content: '...' },
    //   //   'og:image': { property: 'og:image', content: '...' },
    //   //   'twitter:card': { name: 'twitter:card', content: 'summary_large_image' },
    //   //   'twitter:title': { name: 'twitter:title', content: '...' },
    //   //   'twitter:description': { name: 'twitter:description', content: '...' },
    //   //   'twitter:image': { name: 'twitter:image', content: '...' }
    //   // },
    //   minify: {
    //     collapseInlineTagWhitespace: true,
    //     collapseWhitespace: true,
    //     preserveLineBreaks: true,
    //     minifyURLs: true,
    //     removeComments: true,
    //     // * removing attribute quotes may cause problems
    //     // removeAttributeQuotes: true, // <- here is the magic
    //   },
    // } ),

    // * section for multi page websites
    // new HtmlWebpackPlugin({
    //   template: "./src/about.html",
    //   // favicon: "./src/assets/favicon.ico",
    //   chunks: ["about", "index"],
    //   filename: "about.html",
    //   inject: "body",
    //   minify: {
    //     collapseInlineTagWhitespace: true,
    //     collapseWhitespace: true,
    //     preserveLineBreaks: true,
    //     minifyURLs: true,
    //     removeComments: true,
    //     removeAttributeQuotes: true, // <- here is the magic
    //   },
    // }),

    // * add mini css extractor
    // new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),

    // * clear old files
    // new CleanWebpackPlugin(),

    // ! comment to avoid favicon in build
    // new FaviconsWebpackPlugin({
    //   logo: "./src/assets/favicon.png",
    //   outputPath: "./",
    //   prefix: "./",
    // }),

    // * sitemap and robots
    // new SitemapPlugin( { base: "https://mysite.com", paths } ),

    // * copy plugin - uncomment to import assets  if for some reason you need hard path (js has functions that change or reference assets)
    // new CopyPlugin({
    //     patterns: [
    //         { from: './package.json' },
    //         // { from: './assets/copy', to: './copy' },
    //         // { from: "./src/assets", to: "./assets" },
    //     ],
    // }),

    // * bundle analyzer load
    // new BundleAnalyzerPlugin(),

    // * typescript linter
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),

    // * eslint
    new ESLintPlugin({
      extensions: ['tsx', '.ts', 'jsx', '.js'],
      // cache: true,
    }),

    // * dotenv plugin to acces variables. note that all coded vars are public
    // USE PER PROJECT
    // new Dotenv(),
  ].filter(Boolean), // #endregion

  //   !rules
  module: {
    rules: [
      // ! BE CAREFUL IF USING BOTH LOADERS AND ASSETS/RESOURCE
      // if using asset/resource, stored var will be the generated asset path (will create file)

      // * styles
      // ! IMPORT AND STORING IN VARIABLE ARE 2 DIFFERNET THINGS, import can trigger independent
      // ! MINICSS WILL EXTRACT and generate TO SEPARATE FILE
      // style loader doesn't extract to separate file but will inject into the html as soon as called
      // ! CSS LOADER WILL TURN CSS INTO STRING, IF YOU STORE INTO VAR, IT WILL STORE THE STRING ( Css loader interprets imports)
      // ! postcss applies the various improvements
      // ! sass loaders transforms scss to css
      // if you want the variable to store the file path, you need to add/switch this with assets loaders below
      {
        test: /\.(sass|css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader, // ( will create file )
          // 'style-loader', // 3. Inject styles into DOM ( requires document global namespace )
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: '[hash:base64:5]',
              },
              url: false, // resolve url() in css(don't import as files are served in static)
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.dev.js'),
              },
            },
          },
          'sass-loader', // 1. Turns sass into css
        ],
      },

      // // * html
      // ! HTML EXPORTS IMPORTED HTML AS STRING = IF YOU SAVE TO VAR IT WILL STORE THE STRING
      // ! if you want the file, you need to add or switch it in the asset resource extension BELOW
      // if you want the variable to store the file path, you need to add/switch this with assets loaders below
      // ! same thing for scss, css files
      {
        test: /\.html$/,
        use: ['html-loader'],
      },

      // * if using typescript
      // ! supposedly ts loader gives less problems
      // {
      //     test: /\.m?(js|ts)?$/,
      //     exclude: /node_modules/,
      //     // exclude: [/node_modules/, /\.worker\.js$/],
      //     loader: 'babel-loader',
      //     // * in config file
      //     // options: {
      //     // presets: [ "@babel/preset-env", "@babel/preset-typescript" ],
      //     // root: pathsToRoot.pathToRoot
      //     // cacheCompression: false,
      //     // cacheDirectory: true,
      //     // },
      // },

      // with esbuild
      {
        // test: /\.tsx?$/,
        test: /\.m?(js|ts)?$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          loader: 'ts', // Or 'ts' if you don't need tsx
          target: 'es2022',
          // platform: 'node',
          // packages: 'external',
        },
      },

      // with swc loader
      // {
      //     // test: /\.tsx?$/,
      //     test: /\.m?(js|ts)?$/,
      //     exclude: /node_modules/,
      //     use: {
      //         loader: 'swc-loader', // Or 'ts' if you don't need tsx
      //         // options: {},
      //     },
      // },

      // {
      //     test: /\.m?(js|ts)x?$/,
      //     exclude: /node_modules/,
      //     loader: 'ts-loader',
      //     // * in config file
      //     // options: {
      //     // presets: [ "@babel/preset-env", "@babel/preset-typescript" ],
      //     // root: pathsToRoot.pathToRoot
      //     // },
      // },

      // * needed to be able to require and build images in js
      // it's possible to specify path and name for single test prop with options:{name:''}
      {
        // ! if the extension is added here ( scss, html, css), file will still be minimized but the stored variable will represent the path to the generated asset
        // test: /\.(png|jpe?g|gif|mp3|mp4|svg|json|html|scss|css)$/,
        // test: /\.(png|jpe?g|gif|mp3|mp4|svg|html|json|scss|css|txt)$/,
        test: /\.(png|jpe?g|gif|mp3|mp4|svg|txt)$/,
        // test: /\.(png|jpe?g|gif|mp3|mp4|svg|html|scss|css|txt|pug)$/,
        type: 'asset/resource',
        // exclude: /package\.json$/,
        exclude: [/package\.json$/, /pnpm-lock\.yaml$/],
      },

      /**
       * PUG
       */
      // {
      //     test: /\.pug$/,
      //     exclude: /node_modules/,
      //     // include: path.join(__dirname, 'src'),
      //     loader: 'pug-loader',
      // },

      // {
      //     // check https://webpack.js.org/guides/asset-modules/
      //     // ! only for workers
      //     test: /\.worker\.js$/,
      //     type: 'asset/resource',
      //     generator: {
      //         filename: 'workers/[name][ext][query]',
      //     },
      //     // exclude: /package\.json$/,
      // },
    ],
  },

  resolve: {
    modules: ['node_modules'], // something to do with externals
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        /* options: see below */
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
      }),
    ],
  },

  externals: [
    nodeExternals(),
    'child_process',
    'worker_threads',
    // nodeModules
  ],
  externalsPresets: { node: true },

  // externals: {
  // 'express': 'commonjs express',
  // 'winston': 'commonjs winston',
  // 'helmet': 'commonjs helmet',
  // 'body-parser': 'commonjs body-parser',
  // 'cookie-parser': 'commonjs cookie-parser',
  // 'morgan': 'commonjs morgan',
  // },
  // externals: {
  //   'express': 'express',
  //   'winston': 'winston',
  //   'helmet': 'helmet',
  //   'body-parser': 'body-parser',
  //   'cookie-parser': 'cookie-parser',
  //   'morgan': 'morgan',
  // },

  target: 'node',
  // node: {
  //     __dirname: true,
  // },

  //   ! optimizers #region[4]
  // cache: {
  //     type: 'filesystem',
  // },

  optimization: {
    /**
     * ## sideEffects strips out important code? had to disable it
     */
    // runtimeChunk: 'single', // in webpack caching guide
    // usedExports: true,
    // sideEffects: true,
    // providedExports: true,
    // minimize: false,
    minimize: true,
    minimizer: [
      `...`,
      // new TerserPlugin(),
      new CssMinimizerPlugin(),
      new HtmlMinimizerPlugin(),
      new JsonMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                'svgo',
                // {
                //   plugins: extendDefaultPlugins( [
                //     {
                //       name: "removeViewBox",
                //       active: false,
                //     },
                //     {
                //       name: "addAttributesToSVGElement",
                //       params: {
                //         attributes: [ { xmlns: "http://www.w3.org/2000/svg" } ],
                //       },
                //     },
                //   ] ),
                // },
                {
                  name: 'preset-default',
                  overrides: {
                    removeViewBox: false,
                    addAttributesToSVGElement: {
                      attributes: [
                        {
                          xmlns: 'http://www.w3.org/2000/svg',
                        },
                      ],
                    },
                  },
                },
              ],
            ],
          },
        },
      }),
    ],
  },
}; // #endregion
