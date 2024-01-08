/* eslint-disable spellcheck/spell-checker */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable import/no-extraneous-dependencies */
// ! loads
const path = require('node:path');

const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// * bundle analyzer
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// * typescript
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// * eslint
const ESLintPlugin = require('eslint-webpack-plugin');

// *dotenv webpack
const Dotenv = require('dotenv-webpack');

// * imagemin
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
// const { extendDefaultPlugins } = require('svgo');

const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  //
  // ! entry #region [ 4 ]
  // entry: {
  //   common: [ "./src/common.ts" ],
  //   // index: [ "./src/index.ts" ],
  //   // vendor: "./src/vendor.ts",
  //   // * MULTI PAGE SETUP, ADD WHAT NEEDS TO BE INJECTED TO PAGE THEN GO BELOW ON HTMLWEBPACKPLUGIN
  //   // about: ["./src/about.ts"],
  // },

  // ! new feature
  experiments: {
    topLevelAwait: true,
  },

  // ! output
  output: {
    filename: '[name].[contenthash].bundle.js',
    // path: path.resolve( __dirname, "dist" ),
    // * export assets loaded with html loader into path
    assetModuleFilename: 'assets/[name].[contenthash][ext][query]',
  }, // #endregion

  //   !configs
  mode: 'production',
  // devtool: 'source-map',
  // devtool: "source-map",
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
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),

    // * clear old files
    new CleanWebpackPlugin(),

    // ! comment to avoid favicon in build
    // new FaviconsWebpackPlugin({
    //   logo: "./src/assets/favicon.png",
    //   outputPath: "./",
    //   prefix: "./",
    // }),

    // * sitemap and robots
    // new SitemapPlugin( { base: "https://mysite.com", paths } ),

    // * copy plugin - uncomment to import assets  if for some reason you need hard path (js has functions that change or reference assets)
    // new CopyPlugin( {
    //   patterns: [
    //     { from: "./src/robots.txt" },
    //     { from: "./src/assets/copy", to: "./copy" }
    //     // { from: "./src/assets", to: "./assets" },
    //   ],
    // } ),

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
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      // cache: true,
    }),

    // * dotenv plugin to acces variables. note that all coded vars are public
    // new Dotenv({
    //     path: './.front.env', // load this now instead of the ones in '.env'
    //     safe: './.front.env.example', // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
    //     allowEmptyValues: false, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
    //     systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
    //     silent: false, // hide any errors
    //     defaults: false, // load '.env.defaults' as the default values if empty.
    //     // prefix: 'import.meta.env.', // reference your env variables as 'import.meta.env.ENV_VAR'.
    // }),

    new Dotenv(),
    new BundleAnalyzerPlugin(),

    new StylelintPlugin({
      // cache: true
    }),
  ].filter(Boolean), // #endregion

  //   !rules
  module: {
    rules: [
      // * styles
      // {
      //   test: /\.(sass|css|scss)$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     //   "style-loader", //3. Inject styles into DOM
      //     "css-loader", //2. Turns css into commonjs
      //     {
      //       loader: "postcss-loader",
      //       options: {
      //         postcssOptions: {
      //           // config: path.resolve( __dirname, "postcss.config.js" ),
      //           config: path.join( __dirname, "postcss.config.js" ),
      //         },
      //       },
      //     },
      //     "sass-loader", //1. Turns sass into css
      //   ],
      // },

      // ! css modules in 1
      {
        test: /\.(sass|css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          //   "style-loader", //3. Inject styles into DOM
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: '[hash:base64:5]',
              },
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
          'sass-loader',
        ],
        // include: /\.module\.(s?css)$/,
      },
      // {
      //   test: /\.(sass|css|scss)$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     //   "style-loader", //3. Inject styles into DOM
      //     {
      //       loader: "css-loader",
      //       options: {
      //         importLoaders: 1,
      //         modules: true,
      //       },
      //     },
      //     {
      //       loader: "postcss-loader",
      //       options: {
      //         postcssOptions: {
      //           config: path.resolve( __dirname, "postcss.dev.js" ),
      //         },
      //       },
      //     },
      //     "sass-loader",
      //   ],
      //   include: /\.module\.(s?css)$/,
      // },
      // {
      //   test: /\.(sass|css|scss)$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     //   "style-loader", //3. Inject styles into DOM
      //     "css-loader",
      //     {
      //       loader: "postcss-loader",
      //       options: {
      //         postcssOptions: {
      //           config: path.resolve( __dirname, "postcss.dev.js" ),
      //         },
      //       },
      //     },
      //     "sass-loader",
      //   ],
      //   exclude: /\.module\.(s?css)$/,
      // },

      // * html
      {
        test: /\.html$/,
        use: ['html-loader'],
      },

      // * javascript babel transpiler
      // {
      //   test: /\.m?js$/,
      //   exclude: /node_modules/,
      //   loader: "babel-loader",
      //   options: {
      //     presets: ["@babel/preset-env"],
      //   },
      // },

      // * if using typescript
      // in production use babel for polyfills, in dev use ts loader for type checking - not needed with babel
      {
        test: /\.m?(js|ts)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // options: {
        //   // presets: [ "@babel/preset-env", "@babel/preset-typescript" ],
        //   root: pathsToRoot.pathToRoot
        // }
        // * in config file
        // options: {
        //   presets: [ "@babel/preset-env", "@babel/preset-typescript" ],
        // },
        options: {
          // presets: [ "@babel/preset-env", "@babel/preset-typescript" ],
          // root: pathsToRoot.pathToRoot
          // cacheCompression: false,
          // cacheDirectory: true,
        },
      },

      // * needed to be able to require and build images in js
      {
        test: /\.(png|jpe?g|gif|mp3|mp4|txt|json|svg)$/,
        type: 'asset/resource',
        exclude: /package\.json$/,
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  //   ! optimizers #region[4]
  // cache: {
  //     type: 'filesystem',
  // },
  optimization: {
    usedExports: true,
    // moduleIds: 'deterministic', // Added this to retain hash of vendor chunks.
    // runtimeChunk: 'single', // in webpack caching guide to extract runtime
    // splitChunks: {
    //     cacheGroups: {
    //         vendor: {
    //             test: /[/\\]node_modules[/\\]/,
    //             name: 'vendors',
    //             chunks: 'all',
    //         },
    //     },
    // },
    minimize: true,
    minimizer: [
      `...`,
      new TerserPlugin(),
      new CssMinimizerPlugin(),
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
