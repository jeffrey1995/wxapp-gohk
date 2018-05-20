import Vue from 'vue';
import App from './index';

const app = new Vue(App);
app.$mount();
export default {
  config: {
    navigationBarTitleText: '地铁',
    navigationBarTextStyle: 'black',
    navigationBarBackgroundColor: '#ffffff'
  }
};
