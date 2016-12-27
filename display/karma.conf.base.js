function createAugmentConfigFunction(data) {
    return function(config) {
        config.set(data);
    }
}

function buildKarmaCfg(webpackCfg, options) {
    const data = {
        basePath: '',
        browsers: [
            'Chrome',
            //'Firefox',
        ],
        files: [
            'tests/loadtests.js'
        ],
        port: 8107,
        captureTimeout: 10000,
        frameworks: [
            'jasmine',
        ],
        client: {
        },
        singleRun: true,
        reporters: [
            'spec',
            //'coverage',
        ],
        preprocessors: {
            'tests/loadtests.js': [
                'webpack',
                'sourcemap',
            ],
            //'tests/**/*.js': ['babel']
        },
        webpack: webpackCfg,
        webpackServer: {
            noInfo: true
        }
        //coverageReporter: {
        //  dir: 'coverage/',
        //  reporters: [
        //    { type: 'html' },
        //    { type: 'text' }
        //  ]
        //}
    }
    Object.assign(data, options);
    return createAugmentConfigFunction(data);
}

module.exports = {
    buildKarmaCfg,
};