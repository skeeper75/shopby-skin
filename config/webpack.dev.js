const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = () => {
  return merge(common, {
    mode: 'dev',
    devServer: {
      open: false,
      historyApiFallback: true,
      hot: true,
      static: {
        directory: './dist',
      },
      client: {
        overlay: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: ['public/environment.json'],
      }),
      new HtmlWebpackTagsPlugin({
        tags: ['https://shopby-skin.cdn-nhncommerce.com/shopby-external-script.js'],
        append: false,
        usePublicPath: false,
      }),
    ],
  });
};
