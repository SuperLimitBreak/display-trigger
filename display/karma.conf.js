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
    },
    singleRun: true,
    reporters: [ 'coverage', 'spec' ],
    preprocessors: {
      'tests/loadtests.js': [ 'webpack', 'sourcemap' ],
      //'tests/**/*.js': ['babel']
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
