'use strict';
const {buildWebpackCfg} = require('./webpack.config.base.js');
const webpackCfg = buildWebpackCfg(__dirname);

const CopyPlugin = require('copy-webpack-plugin');
webpackCfg.plugins.push(
    new CopyPlugin([
        { from: 'assets', to: 'assets' },
    ]),
);

module.exports = webpackCfg;