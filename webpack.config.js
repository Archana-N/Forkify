//Node package to mention the absolute path in Output
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    //Entry point to start bundeling
    entry: ['@babel/polyfill', './src/js/index.js'],
    //Output point to save the bundelled file
    output: {
        path: path.resolve(__dirname, 'dist'), // must be an absolute path
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};