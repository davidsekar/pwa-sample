const helpers = require('./helpers');
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const webpackMerge = require('webpack-merge'); // used to merge webpack configs

module.exports = function (options) {
    return webpackMerge(commonConfig({ env: 'dev'}), {
        mode: 'development',
        devtool: 'inline-source-map',
        module: {
            rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                // include: [helpers.root('src', 'styles')]
            }]
        }
    });
}