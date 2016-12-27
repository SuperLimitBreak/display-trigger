'use strict';

// Set node environment to testing
process.env.NODE_ENV = 'test';

const {buildWebpackCfg} = require('./webpack.config.base.js');
const {buildKarmaCfg} = require('./karma.conf.base.js');

module.exports = buildKarmaCfg(buildWebpackCfg(__dirname), {});
