const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpackConfig = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: (chunkData) => {
            return `${chunkData.chunk.name}.bundle.js`
        }
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/mode_modules/',
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader', options: { sourceMap: true } },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.stylus$/,
                loader: 'style-loader!css-loader!stylus-loader',
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
        new HtmlWebpackPlugin({
            title: 'es7-cli',
            template: 'index.html',
            hash: true,
            // filename: './dist/index.html',
            minify: {
                removeComments: true, // 去除注释
                collapseWhitespace: true //是否去除空格
            }
        })
    ]
}

module.exports = webpackConfig