/* eslint-disable */
// ! loads
const path = require('node:path');
const { resolve } = require('node:path');
const pathsToRoot = require('./pathToRoot');
const { merge } = require('webpack-merge');

const webpackProd = require(pathsToRoot.pathToRoot + 'webpack.prod.js');

var HtmlWebpackPlugin = require('html-webpack-plugin');

// * sitemap and robots
const SitemapPlugin = require('sitemap-webpack-plugin').default;
// define website paths for sitemap generator
const paths = ['/about/', '/contacts/', '/services/'];
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(webpackProd, {
  //
  // ! entry #region [ 4 ]
  entry: {
    common: ['./src/common.ts'],
    // index: [ "./src/index.ts" ],
    // vendor: "./src/vendor.ts",
    // * MULTI PAGE SETUP, ADD WHAT NEEDS TO BE INJECTED TO PAGE THEN GO BELOW ON HTMLWEBPACKPLUGIN
    // about: ["./src/about.ts"],
  },

  // ! output
  output: {
    path: path.resolve(__dirname, 'dist'),
  }, //#endregion
  //  ! plugins #region [4]
  // * multi page setup
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // * favicon not needed if using faviconswebpackplugin
      // favicon: "./src/assets/favicon.ico",
      // * chunks allow injecting separate entry points as different script bundles per page
      chunks: ['common'],
      // inject: "body",
      // * add meta tags that could be page specific or could change with every build, or copywebpack plugin - can we use the favicon generators?
      // * direct links to assets get compiled, this isn't needed
      // meta: {
      //   'description': { name: 'description', contnet: '...' },
      //   'keyword': { name: 'keywords', content: '...' },
      //   'og:title': { property: 'og:title', content: '...' },
      //   'og:description': { property: 'og:description', content: '...' },
      //   'og:type': { property: 'og:type', content: 'website' },
      //   'og:url': { property: 'og:url', content: '...' },
      //   'og:image': { property: 'og:image', content: '...' },
      //   'twitter:card': { name: 'twitter:card', content: 'summary_large_image' },
      //   'twitter:title': { name: 'twitter:title', content: '...' },
      //   'twitter:description': { name: 'twitter:description', content: '...' },
      //   'twitter:image': { name: 'twitter:image', content: '...' }
      // },
      minify: {
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        preserveLineBreaks: true,
        minifyURLs: true,
        removeComments: true,
        // * removing attribute quotes may cause problems
        // removeAttributeQuotes: true, // <- here is the magic
      },
    }),

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

    // ! comment to avoid favicon in build
    // new FaviconsWebpackPlugin({
    //   logo: "./src/assets/favicon.png",
    //   outputPath: "./",
    //   prefix: "./",
    // }),

    // * sitemap and robots
    new SitemapPlugin({ base: 'https://mysite.com', paths }),

    // * copy plugin - uncomment to import assets  if for some reason you need hard path (js has functions that change or reference assets)
    new CopyPlugin({
      patterns: [
        { from: './src/robots.txt' },
        { from: './src/assets/copy', to: './copy' },
        // { from: "./src/assets", to: "./assets" },
      ],
    }),
  ], // #endregion
});
