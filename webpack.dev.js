const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, "docs"),
        filename: "bundle.js"
    },
    devServer: {
        contentBase: path.resolve(__dirname, "docs"),
        port: 9000,
        filename: 'bundle.js'
    },
});