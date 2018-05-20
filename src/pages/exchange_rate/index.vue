<template>  
  <div class="container">
    <p class="title-text">实时汇率</p>
    <p class="rate-text">{{rate}}</p>
    <form class="form-container">
      <p class="money-text">港币:</p>
      <input type="digit" class="form-control" v-model="f_money" placeholder="请输入金额" v-on:input="f_input()" />
      <p class="money-text">人民币:</p>
      <input type="digit" class="form-control" v-model="t_money" placeholder="请输入金额" v-on:input="t_input()"/>      
    </form>
  </div>
</template>

<script>
import { getSystemInfo } from '@/components/utils/wx';
import fetch from '@/components/utils/fetch';
import { mApiHost } from '@/components/utils/constants';

const Bmob = require('@/lib/app');

const mAPI = {
  rateInfo: `${mApiHost.rate}`
};

export default {
  data: {
    windowHeight: '500px',
    rate: 0,
    f_money: '',
    t_money: '',
    input_form: 0
  },
  watch: {
    f_money: {
      handler(val) {
        if (val === '') {
          this.t_money = '';
        } else if (this.input_form === 1) {
          this.t_money = (parseFloat(val) * this.rate).toFixed(3);
        }
      },
    },
    t_money: {
      handler(val) {
        if (val === '') {
          this.f_money = '';
        } else if (this.input_form === 2) {
          this.f_money = (parseFloat(val) * this.rate).toFixed(3);
        }
      },
    },
  },
  computed: {
  },
  methods: {
    formatDateString65min() {
      const nowDate = new Date();
      const date = new Date();
      date.setTime(Date.parse(nowDate) - (65 * 60 * 1000));
      const Y = `${date.getFullYear()}-`;
      const M = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}-` : `${date.getMonth() + 1}-`;
      const D = date.getDate() < 10 ? `0${date.getDate()} ` : `${date.getDate()} `;
      const h = date.getHours() < 10 ? `0${date.getHours()}:` : `${date.getHours()}:`;
      const m = date.getMinutes() < 10 ? `0${date.getMinutes()}:` : `${date.getMinutes()}:`;
      const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;
      return `${Y + M + D + h + m + s}`;
    },
    async getSystemInfo() {
      const sysInfo = await getSystemInfo();
      this.windowHeight = `${sysInfo.windowHeight}px`;
    },
    async getRate() {
      const ret = await fetch({
        url: mAPI.rateInfo,
        method: 'GET',
        data: {
          app: 'finance.rate',
          scur: 'HKD',
          tcur: 'CNY',
          appkey: '10003',
          sign: 'b59bc3ef6191eb9f747dd4e83c99f2a4'
        }
      });
      this.rate = ret.result.rate;
      const querySave = Bmob.Query('RateInfo');
      querySave.set('data', JSON.stringify(ret.result));
      querySave.save().then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      });
    },
    checkRateInfo() {
      const query = Bmob.Query('RateInfo');
      query.equalTo('createdAt', '>', `${this.formatDateString65min()}`);
      query.find().then((res) => {
        console.log('checkRateInfo then', res);
        if (res.length > 0) {
          const data = JSON.parse(res[0].data);
          this.rate = data.rate;
        } else {
          this.getRate();
        }
      }).catch((err) => {
        console.log('checkRateInfo catch', err);
        this.getRate();
      });
    },
    f_input() {
      this.input_form = 1;
    },
    t_input() {
      this.input_form = 2;
    }
  },
  created() {
    this.getSystemInfo();
  },
  onShow() {
    this.checkRateInfo();
  }
};

</script>
<style>
.form-control {
  height: 38px;
  padding: 0 12px;
  margin: 10px;
  border: 1px solid #ccc;
}
.form-container {
  width: 100%;
  height: 200rpx;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.title-text {
  font-size: 50rpx;
  font-weight: bold;
}
.rate-text {
  font-size: 60rpx;
  font-weight: bold;
}
.money-text {
  margin: 10px;
  font-size: 35rpx；
}
</style>
