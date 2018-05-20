const utils = require('./utils');
const config = require('../config');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: false, // 会导致动态加载的样式带有sourcemap，先去掉
    extract: true,  // 小程序定制，必须设为true,
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
};
