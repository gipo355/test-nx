/* eslint-disable */
// ! loads
// * commented needed in production only

const path = require('node:path');
const { resolve } = require('node:path');
const pathsToRoot = require('./pathToRoot');

const webpackDev = require(`${pathsToRoot.pathToRoot}webpack.dev.js`);
const { merge } = require('webpack-merge');

// common and merge only  if sharing a common config file
// const common = require("./webpack.common");
// const { merge } = require("webpack-merge");

const HtmlWebpackPlugin = require('html-webpack-plugin');
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
const CopyPlugin = require('copy-webpack-plugin');

// * bundle analyzer
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// * typescript

// * eslint

// *dotenv webpack

module.exports = merge(webpackDev, {
  //
  // ! entry
  entry: {
    common: ['./src/common.ts'],
    // index: [ "./src/index.ts" ],
    // vendor: "./src/vendor.ts",
    // * MULTI PAGE SETUP, ADD WHAT NEEDS TO BE INJECTED TO PAGE THEN GO BELOW ON HTMLWEBPACKPLUGIN
    // about: ["./src/about.ts"],
  },

  //   !output
  // * dont use hash, can mess with dev server in development
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  //  ! plugins
  // * multi page setup
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // * favicon not needed if using faviconswebpackplugin
      // favicon: "./src/assets/favicon.ico",
      // * chunks allow injecting separate entry points as different script bundles per page
      chunks: ['common'],
      // inject: "body",
      //   minify: {
      //     collapseInlineTagWhitespace: true,
      //     collapseWhitespace: true,
      //     preserveLineBreaks: true,
      //     minifyURLs: true,
      //     removeComments: true,
      //     removeAttributeQuotes: false, // <- here is the magic
      //   },
    }),

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
    new CopyPlugin({
      patterns: [
        // { from: "./src/robots.txt" },
        // { from: "./src/assets", to: "./assets" },
        { from: './src/assets/copy', to: './copy' },
        { from: './src/views/emails', to: './emails' },
      ],
    }),

    // * bundle analyzer load
    // new BundleAnalyzerPlugin(),
  ],
});
