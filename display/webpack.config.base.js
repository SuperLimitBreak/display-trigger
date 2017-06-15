'use strict';
const webpack = require('webpack');
const path = require('path');

function buildWebpackCfg(dirname, options) {
    if (!dirname) {dirname = __dirname;}

    const serverPort = process.env.SERVER_PORT || 8001;

    const nodeEnv = process.env.NODE_ENV || 'development';
    const isDev = nodeEnv === 'development';
    const isProd = nodeEnv === 'production';

    const sourcePath = path.join(dirname, './src');
    const include_paths = [
        sourcePath,
    ];
    const exclude_paths = [
        '/node_modules/',
    ];
    const webpackCfg = {
        cache: isProd,
        devtool: 'eval-source-map', //isProd ? 'source-map' : 'eval',
        context: sourcePath,
        entry: {
            index: 'index.js',
            export: 'export.js',
            //vendor: [],
            //"app": "./client/app/app.js",
            //"devserver": 'webpack-dev-server/client?http://localhost:3000'
        },
        output: {
            path: path.join(dirname, './static'),
            filename: '[name].bundle.js',
            libraryTarget: 'umd',
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    include: include_paths,
                    exclude: exclude_paths,
                    use: [
                        {loader: 'babel-loader', options: {presets: ['modern-browsers'], cacheDirectory: true}},
                        {loader: 'eslint-loader'},
                    ],
                },
                {
                    test: /\.html$/,
                    include: include_paths,
                    exclude: exclude_paths,
                    use: [
                        {loader: 'file-loader', options: {name: '[name].[ext]'}},
                    ]
                },
                {
                    test: /\.css$/,
                    exclude: exclude_paths,
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'}
                    ]
                },
                {
                    test: /\.scss$/,
                    exclude: exclude_paths,
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'},
                        {loader: 'sass-loader'}, //outputStyle=expanded'
                    ]
                },
            ],
        },
        resolve: {
            extensions: [
                '.webpack-loader.js',
                '.web-loader.js',
                '.loader.js',
                '.js',
                '.jsx'
            ],
            modules: [
                path.resolve(dirname, 'node_modules'),
                sourcePath,
            ],
            alias: {
                src: sourcePath,
            },
        },
        plugins: [
            //new webpack.optimize.CommonsChunkPlugin({
            //    name: 'vendor',
            //    minChunks: Infinity,
            //    filename: 'vendor.bundle.js'
            //}),
            new webpack.DefinePlugin({
                '__ENV__': JSON.stringify(nodeEnv),
                'HOST_STATIC_PORT': JSON.stringify('6543'),
            }),
            new webpack.NamedModulesPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.LoaderOptionsPlugin({
                minimize: isProd,
                debug: !isProd,
            }),
            new webpack.HotModuleReplacementPlugin(),
        ],
        devServer: {
            contentBase: sourcePath,
            historyApiFallback: true,
            port: serverPort,
            compress: isProd,
            inline: !isProd,
            hot: !isProd,
            stats: {
                assets: true,
                children: isDev,
                chunks: isDev,
                hash: false,
                modules: isDev,
                publicPath: false,
                timings: true,
                version: false,
                warnings: true,
                colors: {
                    green: '\u001b[32m',
                }
            },
        }
    };

    if (nodeEnv == 'test') {
        include_paths.push(
            path.join(dirname, './tests')
        );
    }
    if (process.env.LIBRARY_NAME) {
        Object.assign(webpackCfg.output, {
            library: process.env.LIBRARY_NAME,
        });
    }
    if (isProd) {
        webpackCfg.plugins.push(
            //new webpack.optimize.DedupePlugin(),
            //new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true,
                },
                output: {
                    comments: false
                },
            })
        );
    }

    return webpackCfg
}

module.exports = {
    buildWebpackCfg,
};