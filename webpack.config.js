const path = require('path');
const PugPlugin = require('pug-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const buildMode = isProd ? 'production' : 'development';
const sourceMap = isProd ? false : 'eval-source-map';
const outputDir = isProd ? 'build' : 'dist';
const shortFileName = isDev ? '[name]' : '[name].[contenthash]';

module.exports = {
  mode: buildMode,
  devtool: sourceMap,
  context: path.resolve(__dirname, 'src'),

  entry: {
    index: 'index.pug',
  },

  output: {
    path: path.resolve(__dirname, outputDir),
    assetModuleFilename: `asset/${shortFileName}[ext][query]`,
    clean: true,
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimize: isProd,
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ],
  },

  plugins: [
    new PugPlugin({
      pretty: !isProd,
      //   Format HTML (only in dev mode)
      js: {
        filename: `${shortFileName}.js`,
      },
      css: {
        filename: `${shortFileName}.css`,
      },
    }),

  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: `img/${shortFileName}[ext][query]`,
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: `font/${shortFileName}[ext][query]`,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },

  watchOptions: {
    ignored: /node_modules/,
  },

  devServer: {
    watchFiles: path.join(__dirname, 'src'),
    port: 9000,
    open: true,
    hot: isDev,
  },
};
