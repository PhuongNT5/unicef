// const fs = require('fs');
const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const glob = require('glob');
const AutoPrefixer = require('autoprefixer');
// const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const cssNano = require('cssnano');

const entry = {
  main: './working_unicef/app/scripts/project/main.js',
};

const pages = glob
  .sync('./working_unicef/app/scripts/project/pages/*.js')
  .reduce((x, y) => Object.assign(x, {
    [`page_${path.basename(y, '.js')}`]: y,
  }), {});

const dynamic = glob
  .sync('./working_unicef/app/scripts/project/widgets/*.js')
  .reduce((x, y) => Object.assign(x, {
    [`widgets/${path.basename(y, '.js')}`]: y,
  }), {});

Object.assign(pages, dynamic);
Object.assign(entry, pages);

const resourceInSCSS = [];

module.exports = {
  mode: 'production',
  target: 'web',
  entry,
  output: {
    path: path.resolve(__dirname, 'themes/unicef/assets/'),
    filename: 'js/[name].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        // // vendor chunk
        vendor: {
          name: 'vendor',
          // sync + async chunks
          chunks: 'all',
          // import file path containing node_modules
          test: /(node_modules)/,
        },
        common: {
          name: 'common',
          chunks: 'all',
          reuseExistingChunk: true,
          enforce: true,
          test: /[\\/]brayleinosplash[\\/]/,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          }, {
            loader: 'css-loader',
            options: {
              url: (url) => {
                if (url.includes('fonts')) {
                  return true;
                }
                const n = url.split('/');
                resourceInSCSS.push({
                  context: './working_unicef/app/images/',
                  from: `**/${n[n.length - 1]}`,
                  to: '../images/',
                });
                return false;
              },
            },
          }, {
            loader: 'postcss-loader',
            options: {
              autoprefixer: {
                browsers: ['last 2 versions'],
              },
              plugins: () => [
                AutoPrefixer('last 2 versions', 'ie >= 10'),
              ],
            },
          }, {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /.(fonts.*).(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
            publicPath: '../fonts/',
          },
        }],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssNano,
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    }),
    new CopyWebpackPlugin(resourceInSCSS),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
      statsOptions: { source: false },
    }),
    // new HtmlWebpackPlugin(),
  ],
};
