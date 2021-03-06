const helpers = require('./helpers');
const WebpackInlineManifestPlugin = require('webpack-inline-manifest-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (options) {
  var metadata = {};
  metadata.publicPath = '/pwa-sample/';
  var copyFiles = [{
    from: 'src/static-img',
    to: 'img'
  }];

  if (options.env == 'dev') {
    metadata.isDevServer = true;
    metadata.HMR = true;
    metadata.publicPath = '/';
    copyFiles.push({
      from: 'src/manifest.json',
      to: '[name].[ext]'
    });
  } else {
    copyFiles.push({
      from: 'src/manifest-prod.json',
      to: 'manifest.json'
    });
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
      publicPath: metadata.publicPath
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
        metadata: metadata,
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
      new WorkboxPlugin.InjectManifest({
        importWorkboxFrom: 'local',
        swSrc: './src/sw.js'
      }),
      new CopyWebpackPlugin(copyFiles)
    ]
  };
}