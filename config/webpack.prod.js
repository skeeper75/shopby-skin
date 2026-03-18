const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

// @MX:NOTE: VERCEL_ENV 유무로 빌드 환경을 구분
//   - Vercel 배포 시: VERCEL_ENV 가 자동 주입됨 (preview | production | development)
//   - 기존 CDN 빌드 시: VERCEL_ENV 가 없으므로 기존 동작 그대로 유지
const isVercelBuild = Boolean(process.env.VERCEL_ENV);

// @MX:ANCHOR: CDN 외부 스크립트 주입 여부를 결정하는 플러그인 팩토리
// @MX:REASON: Vercel 도메인에서는 CDN 스크립트가 CORS/보안 정책으로 동작하지 않을 수 있음
// @MX:SPEC: SPEC-INFRA-001 TAG-004
const buildPlugins = () => {
  const plugins = [
    new MiniCssExtractPlugin({
      linkType: false,
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ];

  if (!isVercelBuild) {
    // 기존 CDN 빌드 파이프라인 — 변경 없이 유지
    plugins.push(
      new HtmlWebpackTagsPlugin({
        tags: [
          'https://shopby-skin.cdn-nhncommerce.com/shopby-external-script.js',
          'https://shopby-skin.cdn-nhncommerce.com/netfunnel.js',
        ],
        append: false,
        usePublicPath: false,
      }),
    );
  }

  return plugins;
};

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
    plugins: buildPlugins(),
  });
