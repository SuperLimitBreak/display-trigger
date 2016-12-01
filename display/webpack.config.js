'use strict';

const webpack = require('webpack');
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const sourcePath = path.join(__dirname, './src');
const staticsPath = path.join(__dirname, './static');
const testPath = path.join(__dirname, './tests');
const include_paths = [
    sourcePath,
];
const exclude_paths = [
    '/node_modules/',
];

if (nodeEnv == 'test') {
    include_paths.push(testPath);
}

const plugins = [
    //new webpack.optimize.CommonsChunkPlugin({
    //    name: 'vendor',
    //    minChunks: Infinity,
    //    filename: 'vendor.bundle.js'
    //}),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
      'HOST_STATIC_PORT': JSON.stringify('6543'),
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
        minimize: isProd,
        debug: !isProd,
    }),
    new webpack.HotModuleReplacementPlugin(),
];



if (isProd) {
    plugins.push(
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

const webpackCfg = {
    cache: isProd,
    devtool: 'eval-source-map', //isProd ? 'source-map' : 'eval',
    context: sourcePath,
    entry: {
        js: 'index.js',
        //vendor: [],
        //"app": "./client/app/app.js",
        //"devserver": 'webpack-dev-server/client?http://localhost:3000'
    },
    output: {
        path: staticsPath,
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: include_paths,
                exclude: exclude_paths,
                use: [
                    'babel-loader',
                    'eslint-loader',
                ],
                query: {
                    presets: [
                        'modern-browsers',
                        //'es2015',
                        //{ "modules": false }
                    ],
                    cacheDirectory: true,
                }
            },
            {
                test: /\.html$/,
                exclude: exclude_paths,
                use: 'file-loader',
                query: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.css$/,
                exclude: exclude_paths,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.scss$/,
                exclude: exclude_paths,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader', //outputStyle=expanded'
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
            path.resolve(__dirname, 'node_modules'),
            sourcePath,
        ],
        alias: {
            src: sourcePath,
        },
    },
    plugins,
    devServer: {
        contentBase: sourcePath,
        historyApiFallback: true,
        port: 8001,
        compress: isProd,
        inline: !isProd,
        hot: !isProd,
        stats: {
            assets: true,
            children: true,
            chunks: true,
            hash: false,
            modules: true,
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

module.exports = webpackCfg;