/* eslint-disable spellcheck/spell-checker */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/prefer-module */
// ! loads
// * commented needed in production only

const path = require('node:path');
// const { resolve } = require('node:path');
// const fs = require('node:fs');

// const pathsToRoot = require( './pathToRoot' );

// common and merge only  if sharing a common config file
// const common = require("./webpack.common");
// const { merge } = require("webpack-merge");

// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const TerserPlugin = require("terser-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

// * sitemap and robots
// const SitemapPlugin = require("sitemap-webpack-plugin").default;
// const paths = ["/about/", "/contacts/", "/services/"];
// const CopyPlugin = require("copy-webpack-plugin");

// * copy plugin - may be needed if in js you reference assets and hard path that won't be built with htmlloader, alternatively, use the asset/resource loader and use require in js
// const CopyPlugin = require('copy-webpack-plugin');

// * bundle analyzer
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// * typescript
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// * eslint
const ESLintPlugin = require('eslint-webpack-plugin');

// *dotenv webpack
// const Dotenv = require('dotenv-webpack');

const StylelintPlugin = require('stylelint-webpack-plugin');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  //
  // ! entry
  // entry: {
  // common: [ "./src/common.ts" ],
  // index: [ "./src/index.ts" ],
  // vendor: "./src/vendor.ts",
  // * MULTI PAGE SETUP, ADD WHAT NEEDS TO BE INJECTED TO PAGE THEN GO BELOW ON HTMLWEBPACKPLUGIN
  // about: ["./src/about.ts"],
  // },

  //   !output
  // * dont use hash, can mess with dev server in development
  output: {
    filename: '[name].bundle.js',
    // path: path.resolve( __dirname, "dist" ),
    // * export assets loaded with html loader into path
    assetModuleFilename: 'assets/[name][ext][query]',
  },

  // ! new feature
  experiments: {
    topLevelAwait: true,
  },

  //   !configs
  mode: 'development',
  devtool: 'cheap-source-map',
  // devtool: "source-map",
  // config to make live reload of dev server work

  // ! breaking change, enable https per project
  devServer: {
    hot: true,
    // liveReload: true,
    host: '127.0.0.1',
    // contentBase: ['./src', './dist'], // both src and output dirs
    // inline: true,
    // host: 'courses-pnpm.localhost',
    // https: {
    //     key: fs.readFileSync('./certs/courses-pnpm.dev-key.pem'),
    //     cert: fs.readFileSync('./certs/courses-pnpm.dev.pem'),
    // },
    // server: {
    //     type: 'https',
    // options: {
    //     key: fs.readFileSync('./certs/courses-pnpm.dev-key.pem'),
    //     cert: fs.readFileSync('./certs/courses-pnpm.dev.pem'),
    // },
    // },
  },

  //  ! plugins
  // * multi page setup
  plugins: [
    // new HtmlWebpackPlugin( {
    //   template: "./src/index.html",
    //   // * favicon not needed if using faviconswebpackplugin
    //   // favicon: "./src/assets/favicon.ico",
    //   // * chunks allow injecting separate entry points as different script bundles per page
    //   chunks: [ "common" ],
    //   // inject: "body",
    //   //   minify: {
    //   //     collapseInlineTagWhitespace: true,
    //   //     collapseWhitespace: true,
    //   //     preserveLineBreaks: true,
    //   //     minifyURLs: true,
    //   //     removeComments: true,
    //   //     removeAttributeQuotes: false, // <- here is the magic
    //   //   },
    // } ),

    // * section for multi page websites
    // new HtmlWebpackPlugin({
    //   template: "./src/about.html",
    //   // favicon: "./src/assets/favicon.ico",
    //   chunks: ["about", "index"],
    //   filename: "about.html",
    //   inject: "body",
    //   // minify: {
    //   //   collapseInlineTagWhitespace: true,
    //   //   collapseWhitespace: true,
    //   //   preserveLineBreaks: true,
    //   //   minifyURLs: true,
    //   //   removeComments: true,
    //   //   removeAttributeQuotes: true, // <- here is the magic
    //   // },
    // }),

    // * add mini css extractor, like most other comments, not needed in dev
    // * as dev server loads in memory and use style loader to inject css into style tag into head
    // new MiniCssExtractPlugin({ filename: "[name].[contentHash].css" }),

    // * clear old files
    // new CleanWebpackPlugin(),

    // ! comment to avoid favicon in build
    // new FaviconsWebpackPlugin({
    //   logo: "./src/assets/favicon.png",
    //   outputPath: "./",
    //   prefix: "./",
    // }),

    // * copy plugin if assets hardpath is needed
    // new CopyPlugin( {
    //   patterns: [
    //     // { from: "./src/robots.txt" },
    //     // { from: "./src/assets", to: "./assets" },
    //     { from: "./src/assets/copy", to: "./copy" }
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
      // async: true
    }),

    // * eslint
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      // failOnWarning: false,
      // emitWarning: false,
      // cache: true,
    }),

    // * dotenv plugin to acces variables. note that all coded vars are public
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
    // new Dotenv(),

    new StylelintPlugin({
      // cache: true
    }),

    new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),

  //   !rules
  module: {
    rules: [
      // * styles
      // {
      //   test: /\.(sass|css|scss)$/,
      //   use: [
      //     // MiniCssExtractPlugin.loader,
      //     "style-loader", //3. Inject styles into DOM
      //     "css-loader", //2. Turns css into commonjs
      //     {
      //       loader: "postcss-loader",
      //       options: {
      //         postcssOptions: {
      //           // config: path.resolve( __dirname, "postcss.config.js" ),
      //           config: path.join( __dirname, "postcss.dev.js" ),
      //         },
      //       },
      //     },
      //     "sass-loader", //1. Turns sass into css
      //   ],
      // },

      // ! trying modules all in 1
      {
        test: /\.(sass|css|scss)$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'style-loader', // 3. Inject styles into DOM
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
      },

      // {
      //   test: /\.(sass|css|scss)$/,
      //   use: [
      //     // MiniCssExtractPlugin.loader,
      //     "style-loader", //3. Inject styles into DOM

      //     // "css-loader", //2. Turns css into commonjs
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
      //     "sass-loader", //1. Turns sass into css
      //   ],
      //   include: /\.module\.(s?css)$/,
      // },
      // {
      //   test: /\.(sass|css|scss)$/,
      //   use: [
      //     // MiniCssExtractPlugin.loader,
      //     "style-loader", //3. Inject styles into DOM

      //     // "css-loader", //2. Turns css into commonjs

      //     "css-loader",

      //     {
      //       loader: "postcss-loader",
      //       options: {
      //         postcssOptions: {
      //           config: path.resolve( __dirname, "postcss.dev.js" ),
      //         },
      //       },
      //     },
      //     "sass-loader", //1. Turns sass into css
      //   ],
      //   exclude: /\.module\.(s?css)$/,
      // },

      // * html
      {
        test: /\.html$/,
        use: ['html-loader'],
      },

      // * js transpiler babel - uncomment this if only js
      // {
      //   test: /\.m?(js)x?$/,
      //   exclude: /node_modules/,
      //   loader: "babel-loader",
      //   options: {
      //     presets: ["@babel/preset-env"],
      //   },
      // },

      // * if using typescript
      {
        // test: /\.m?(js|ts)x?$/,
        test: /\.m?(js|ts)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // * in config file
        options: {
          // presets: [ "@babel/preset-env", "@babel/preset-typescript" ],
          // root: pathsToRoot.pathToRoot
          // cacheCompression: false,
          // cacheDirectory: true,
        },
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // * in config file
        options: {
          plugins: [require.resolve('react-refresh/babel')],
          // presets: [ "@babel/preset-env", "@babel/preset-typescript" ],
          // root: pathsToRoot.pathToRoot
          // cacheCompression: false,
          // cacheDirectory: true,
        },
      },

      // * ASSETS / needed to be able to require and build images in js
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

  //   ! optimizers
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
    // minimizer: [`...`, new CssMinimizerPlugin()],
  },
};
