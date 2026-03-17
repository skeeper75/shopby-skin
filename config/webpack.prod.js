const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = () =>
  merge(common, {
    mode: 'prod',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        linkType: false,
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
      new HtmlWebpackTagsPlugin({
        tags: [
          'https://shopby-skin.cdn-nhncommerce.com/shopby-external-script.js',
          'https://shopby-skin.cdn-nhncommerce.com/netfunnel.js',
        ],
        append: false,
        usePublicPath: false,
      }),
    ],
  });
