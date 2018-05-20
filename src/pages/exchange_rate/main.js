import Vue from 'vue';
import App from './index';

const app = new Vue(App);
app.$mount();
export default {
  config: {
    navigationBarTitleText: '汇率转换',
    navigationBarTextStyle: 'black',
    navigationBarBackgroundColor: '#ffffff'
  }
};
