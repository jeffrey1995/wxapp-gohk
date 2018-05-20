import Vue from 'vue';
import App from './App';
/* eslint-disable */
// Bmob.initialize('079e6549abec6a4fbbdb36e97cdad907', '366cf8d145ffec58eebce3d790a50b45');
// var Bmob = require('@/lib/app');

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App);
app.$mount();

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['pages/logs/main', '^pages/index/main', 'pages/mycenter/main', 'pages/subway/main', 'pages/exchange_rate/main', 'pages/list_detail/main'],
    window: {
      backgroundColor: '#f3f3f3',
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
    },
    tabBar: {
      borderStyle: 'black',
      backgroundColor: '#fff',
      color: '#cccccc',
      selectedColor: '#7579FF',
      list: [{
        pagePath: 'pages/index/main',
        iconPath: 'static/imgs/icon_index_n.png',
        selectedIconPath: 'static/imgs/icon_index_s.png',
        text: '出发'
      }, {
        pagePath: 'pages/mycenter/main',
        iconPath: 'static/imgs/icon_me_n.png',
        selectedIconPath: 'static/imgs/icon_me_s.png',
        text: '我的'
      }]
    },
  },
};
