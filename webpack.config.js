const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpackConfig = {
    entry: {
        'page.parent': './src/js/parent/index.js',
        'page.child': './src/js/child/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].min.js'
    },
    devServer: {
        openPage: 'index.html'
    },
    module: {
        rules: [{
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                    { loader: 'stylus-loader' }
                ]
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg|ttf)$/,
                loader: 'url-loader',
                options: {
                    limit: 1024
                }
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['page.parent'],
            title: 'Page 前端标签页框架',
            template: './src/template/index.html',
            inject: 'head',
            hash: true,
            minify: false
        }),
        new HtmlWebpackPlugin({
            filename: './module/home.html',
            chunks: ['page.child'],
            template: './src/template/module/home.html',
            inject: 'head',
            hash: true,
            minify: false
        }),
        new HtmlWebpackPlugin({
            filename: './module/module1.html',
            chunks: ['page.child'],
            template: './src/template/module/module1.html',
            inject: 'head',
            hash: true,
            minify: false
        }),
        new HtmlWebpackPlugin({
            filename: './module/module2.html',
            chunks: ['page.child'],
            template: './src/template/module/module2.html',
            inject: 'head',
            hash: true,
            minify: false
        })
    ]
}

module.exports = () => {
    return webpackConfig
}