const path = require('path');
const fs = require('fs');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const MpvuePlugin = require('webpack-mpvue-asset-plugin');
const glob = require('glob');


console.log('channel:', config.channel);

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

function getEntry(rootSrc, pattern) {
  var files = glob.sync(path.resolve(rootSrc, pattern))
  return files.reduce((res, file) => {
    var info = path.parse(file)
    var key = info.dir.slice(rootSrc.length + 1) + '/' + info.name
    res[key] = path.resolve(file)
    return res
  }, {})
}

const appEntry = { app: resolve('./src/main.js') };
const pagesEntry = getEntry(resolve('./src'), 'pages/**/main.js')
const entry = Object.assign({}, appEntry, pagesEntry);

// 这里使用正则，不匹配@mucfc.com|@mu/xxx里面的node_modules，分割符须兼容windows
const pathSep = path.sep;
const re = new RegExp(`node_modules\\${pathSep}@mu(cfc\\.com)?\\${pathSep}((?!node_modules).)*$`);
const loaderIncDir = [re, resolve('src'), resolve('static')];
const loaderExcludeDir = [
  resolve('node_modules/@mucfc.com/H2O'),
  resolve('node_modules/@mucfc.com/rum-vue-plugin'),
  resolve('node_modules/@mucfc.com/geetest'),
  resolve('node_modules/@mucfc.com/webapp-api-sign'),
  resolve('node_modules/@mub')
];

module.exports = {
  entry,
  target: require('mpvue-webpack-target'),
  resolve: {
    extensions: ['.js', '.vue', '.json', '.less'],
    alias: {
      'vue$': 'mpvue',
      '@': resolve('src'),
      comp: resolve('src/components'),
      static: resolve('static')
    },
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: loaderIncDir,
        exclude: loaderExcludeDir,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'mpvue-loader',
        include: loaderIncDir,
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        include: loaderIncDir,
        exclude: loaderExcludeDir,
        use: [
          'babel-loader',
          {
            loader: 'mpvue-loader',
            options: {
              checkMPEntry: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[ext]'
        }
      },
    ]
  },
  plugins: [
    new MpvuePlugin(),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].wxss')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // 这里关闭 http://cssnano.co/optimisations/reducetransforms/ 这个选项，因为会导致ios下切页动画闪烁
    // 注意，这里是cssnano 3.x.x的语法，以后升级到4+配置语法会变！
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
        postcssReduceTransforms: {
          disable: true
        },
      }
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf('node_modules') >= 0
        ) || count > 1
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new webpack.DefinePlugin({
      /** API域名 */
      _WEBPACK_API_DOMAIN: JSON.stringify(config.apiDomain),
      /** URL域名 */
      _WEBPACK_URL_DOMAIN: JSON.stringify(config.urlDomain),
      /** 构建环境 */
      _WEBPACK_BUILD_MODE: JSON.stringify(config.buildMode),
      /** 发布渠道 */
      _WEBPACK_CHANNEL: JSON.stringify(config.channel),
      /** 小程序APPID */
      _WEBPACK_APPID: JSON.stringify(config.appid)
    }),
  ]
};
