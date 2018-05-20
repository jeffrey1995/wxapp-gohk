require('./check-versions')();
const config = require('../config');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}
const path = require('path');
const webpack = require('webpack');
const express = require('express');
const proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = require('./webpack.dev.conf');
const portfinder = require('portfinder');

const proxyTable = config.dev.proxyTable;

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port;

const app = express();
const compiler = webpack(webpackConfig);

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context];
  if (typeof options === 'string') {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

let _resolve;
const readyPromise = new Promise((resolve) => {
  _resolve = resolve;
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = port;
  portfinder.getPortPromise()
    .then(newPort => {
      if (port !== newPort) {
        console.log(`${port}端口被占用，开启新端口${newPort}`)
      }
      const server = app.listen(newPort, 'localhost');
      // for 小程序的文件保存机制
      require('webpack-dev-middleware-hard-disk')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        quiet: true
      });
      resolve({
        ready: readyPromise,
        close: () => {
          server.close();
        }
      })
    }).catch(error => {
      console.log('没有找到空闲端口，请打开任务管理器杀死进程端口再试', error);
    })
});
