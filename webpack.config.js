const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpackConfig = {
    entry: {
        parent: './src/index.js',
        child: './src/child/index.js',
        all: './src/all.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/page.[name].min.js',
        // library: '[name]Page',
        libraryTarget: 'umd'
    },
    devServer: {
        openPage: 'index.html'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [{ loader: MiniCssExtractPlugin.loader }, { loader: 'css-loader' }, { loader: 'postcss-loader' }]
            },
            {
                test: /\.styl$/,
                use: [{ loader: MiniCssExtractPlugin.loader }, { loader: 'css-loader' }, { loader: 'postcss-loader' }, { loader: 'stylus-loader' }]
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg|ttf|eot|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 5000
                }
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/page.[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false // Enable to remove warnings about conflicting order
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['parent'],
            title: 'Page 前端标签页框架',
            template: './example/index.html',
            inject: 'head',
            hash: true,
            minify: false
        }),
        new HtmlWebpackPlugin({
            filename: './module/home.html',
            chunks: ['child'],
            template: './example/module/home.html',
            inject: 'head',
            hash: true,
            minify: false
        }),
        new HtmlWebpackPlugin({
            filename: './module/module1.html',
            chunks: ['child'],
            template: './example/module/module1.html',
            inject: 'head',
            hash: true,
            minify: false
        }),
        new HtmlWebpackPlugin({
            filename: './module/module2.html',
            chunks: ['child'],
            template: './example/module/module2.html',
            inject: 'head',
            hash: true,
            minify: false
        })
    ]
}

module.exports = () => {
    return webpackConfig
}
