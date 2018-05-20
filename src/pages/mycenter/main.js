import Vue from 'vue';
import App from './index';

const app = new Vue(App);
app.$mount();
export default {
  config: {
    navigationBarTitleText: '',
    navigationBarTextStyle: 'black',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#7579FF'
  }
};
