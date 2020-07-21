const path = require('path');
const { resolve } = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATHS = {
  source: path.join(__dirname, 'source'),
  build: path.join(__dirname, 'app'),
  material: path.join(__dirname, 'node_modules'),
};

module.exports = {
  mode: process.env.NODE_ENV,
  watch: process.env.NODE_ENV === 'development',
  devtool:
    process.env.NODE_ENV === 'production' ? '' : 'inline-source-map',
  entry: {
    bg: `${PATHS.source}/bg/app.js`,
    popup: `${PATHS.source}/popup/app.js`,
  },
  output: {
    path: PATHS.build,
    filename: '[name]/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'node-sass',
            ],
            js: {
              loader: 'babel-loader',
              options: { presets: ['@babel/preset-env'] },
            },
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [`${PATHS.material}`],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [resolve('app/**/*')],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'static',
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name]/styles.css',
    }),
  ],
};
