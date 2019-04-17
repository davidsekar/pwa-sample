const helpers = require('./helpers');
const WebpackInlineManifestPlugin = require('webpack-inline-manifest-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = function (options) {
  var metadata = {};
  if (options.env == 'dev') {
    metadata.isDevServer = true;
    metadata.HMR = true;
  }
  return {
    entry: './src/index.js',
    devServer: {
      contentBase: './docs'
    },
    module: {
      rules: [{
        test: /\.(png|jpg)$/,
        use: ['url-loader']
      }]
    },
    output: {
      filename: 'main.js',
      path: helpers.root('docs'),
      publicPath: '/'
    },
    plugins: [
      /*
       * Plugin: HtmlWebpackPlugin
       * Description: Simplifies creation of HTML files to serve your webpack bundles.
       * This is especially useful for webpack bundles that include a hash in the filename
       * which changes every compilation.
       *
       * See: https://github.com/ampedandwired/html-webpack-plugin
       */
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        title: 'PWA demo - Ideathon',
        chunksSortMode: function (a, b) {
          const entryPoints = ['inline', 'polyfills', 'sw-register', 'styles', 'vendor', 'main'];
          return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
        },
        metadata: {
          isDevServer: metadata.isDevServer,
          HMR: metadata.HMR
        },
        inject: 'body',
        xhtml: true,
        minify: false ? {
          caseSensitive: true,
          collapseWhitespace: true,
          keepClosingSlash: true
        } : false
      }),

      /**
       * Plugin: ScriptExtHtmlWebpackPlugin
       * Description: Enhances html-webpack-plugin functionality
       * with different deployment options for your scripts including:
       *
       * See: https://github.com/numical/script-ext-html-webpack-plugin
       */
      new ScriptExtHtmlWebpackPlugin({
        sync: /inline|polyfills|vendor/,
        defaultAttribute: 'async',
        preload: [/polyfills|vendor|main/],
        prefetch: [/chunk/]
      }),
      new WorkboxPlugin.GenerateSW({
        // these options encourage the ServiceWorkers to get in there fast 
        // and not allow any straggling "old" SWs to hang around
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        importWorkboxFrom: 'local'
      })
    ]
  };
}