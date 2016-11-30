'use strict';

const webpack = require('webpack');
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const sourcePath = path.join(__dirname, './src');
const staticsPath = path.join(__dirname, './static');
const exclude_paths = [
    '/node_modules/',
];

const plugins = [
    //new webpack.optimize.CommonsChunkPlugin({
    //  name: 'vendor',
    //  minChunks: Infinity,
    //  filename: 'vendor.bundle.js'
    //}),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
      'HOST_STATIC_PORT': JSON.stringify('6543'),
    }),
    new webpack.NamedModulesPlugin(),
    //new webpack.HotModuleReplacementPlugin(),
    //new webpack.NoErrorsPlugin(),
];

if (isProd) {
    plugins.push(
        //new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: !isProd,
        }),
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

module.exports = {
    //debug: true,
    cache: isProd,
    devtool: isProd ? 'source-map' : 'eval',
    context: sourcePath,
    entry: {
        js: './index.js',
        //vendor: ['react']
    },
    output: {
        path: staticsPath,
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: exclude_paths,
                use: [
                    'babel-loader'
                    //'eslint-loader',
                ],
                query: {
                    presets: ['modern-browsers'],  //, { "modules": false }
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
        ]
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
            children: false,
            chunks: false,
            hash: false,
            modules: false,
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

