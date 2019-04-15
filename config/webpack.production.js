const helpers = require('./helpers');
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

/***
 * Ref: https://github.com/mishoo/UglifyJS2/tree/harmony#minify-options
 * @param enableCompress disabling compress could improve the performance, see https://github.com/webpack/webpack/issues/4558#issuecomment-352255789
 * @returns {{ecma: number, warnings: boolean, ie8: boolean, mangle: boolean, compress: {pure_getters: boolean, passes: number}, output: {ascii_only: boolean, comments: boolean}}}
 */
function getUglifyOptions(enableCompress) {
    const uglifyCompressOptions = {
        pure_getters: true /* buildOptimizer */ ,
        // PURE comments work best with 3 passes.
        // See https://github.com/webpack/webpack/issues/2899#issuecomment-317425926.
        passes: 2 /* buildOptimizer */
    };

    return {
        ecma: 5,
        warnings: false, // TODO verbose based on option?
        ie8: false,
        mangle: true,
        compress: enableCompress ? uglifyCompressOptions : false,
        output: {
            ascii_only: true,
            comments: false
        }
    };
}

module.exports = function (options) {
    return webpackMerge(commonConfig({ env: 'prod'}), {
        mode: 'production',
        module: {
            rules: [{
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                // include: [helpers.root('src', 'styles')]
            }]
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    sourceMap: true,
                    parallel: true,
                    cache: helpers.root('webpack-cache/uglify-cache'),
                    uglifyOptions: getUglifyOptions(true)
                })
            ],
            splitChunks: {
                chunks: 'all'
            }
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name]-[hash].css',
                chunkFilename: '[name]-[chunkhash].css'
            })
        ]
    });
}