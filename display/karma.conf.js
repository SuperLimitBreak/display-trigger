var webpackCfg = require('./webpack.config');

// Set node environment to testing
process.env.NODE_ENV = 'test';

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: [ 'PhantomJS' ],
    files: [
      'tests/loadtests.js'
    ],
    port: 8107,
    captureTimeout: 10000,
    frameworks: [ 'jasmine' ],
    client: {
      mocha: {}
    },
    singleRun: true,
    reporters: [ 'coverage' ],
    preprocessors: {
      'tests/loadtests.js': [ 'webpack', 'sourcemap' ]
    },
    webpack: webpackCfg,
    webpackServer: {
      noInfo: true
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html' },
        { type: 'text' }
      ]
    }
  });
};
