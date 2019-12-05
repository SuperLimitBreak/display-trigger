'use strict';
const {buildWebpackCfg} = require('./webpack.config.base.js');
const webpackCfg = buildWebpackCfg(__dirname);

module.exports = webpackCfg;
