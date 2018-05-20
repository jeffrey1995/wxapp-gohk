<template>
  <view style="width:100%;height:180rpx;display: block;position: relative;">
    <div class="container main" :style="'width:100%;height: '+windowHeight" @click="clickHandle('test click', $event)">
    <weatherCard :city="city" :type="type" :date="date" :wendu="wendu" :quality="quality" :low="low" :high="high" :notice="notice"/>
    <img style="width:295rpx;height:390rpx;margin-top:1px;margin-right:10px;align-self:flex-end" :src="'../../static/imgs/boy.png'"/>    
    <div class="container_content">
      <div class="function_01" @click="toSubway()">
        <img :src="'../../static/imgs/ic_subway.png'" style="width:17px;height:18px;margin-right:10px;" />
        地铁
      </div>
      <div class="function_02" @click="toExchangeRate()">
        <img :src="'../../static/imgs/money.png'" style="width:17px;height:18px;margin-right:10px;" />
        汇率
      </div>
    </div>
  </div>
  </view>
  
</template>

<script>
import card from '@/components/card';
import weatherCard from '@/components/weatherCard';
import fetch from '@/components/utils/fetch';
import { mApiHost } from '@/components/utils/constants';
import { getStorage, setStorage, getSystemInfo } from '@/components/utils/wx';

const Bmob = require('@/lib/app');

// import Bmob from '@/components/utils/bmob';

const mAPI = {
  weatherInfo: `${mApiHost.weather}open/api/weather/json.shtml`
};

export default {
  data() {
    return {
      motto: 'Hello World',
      userInfo: {},
      city: '香港',
      type: '',
      date: '',
      quality: '',
      wendu: 0,
      low: 0,
      high: 0,
      notice: '',
      weather_data: {},
      windowHeight: '100%',
    };
  },

  components: {
    card,
    weatherCard
  },

  methods: {
    formatDateString30min() {
      const nowDate = new Date();
      const date = new Date();
      date.setTime(Date.parse(nowDate) - (120 * 60 * 1000));
      const Y = `${date.getFullYear()}-`;
      const M = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}-` : `${date.getMonth() + 1}-`;
      const D = date.getDate() < 10 ? `0${date.getDate()} ` : `${date.getDate()} `;
      const h = date.getHours() < 10 ? `0${date.getHours()}:` : `${date.getHours()}:`;
      const m = date.getMinutes() < 10 ? `0${date.getMinutes()}:` : `${date.getMinutes()}:`;
      const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;
      return `${Y + M + D + h + m + s}`;
    },
    toSubway() {
      wx.navigateTo({
        url: '../subway/main'
      });
    },
    toExchangeRate() {
      wx.navigateTo({
        url: '../exchange_rate/main'
      });
    },
    async bindViewTap() {
      // const url = '../logs/main';
      // wx.navigateTo({ url });
      this.getWeather();
    },
    getUserInfo() {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo;
            },
          });
        },
      });
    },
    clickHandle(msg, ev) {
      /* eslint-disable no-console */
      console.log('clickHandle:', msg, ev);
    },
    async requestWeatherData(data) {
      if (data) {
        /* eslint-disable no-console */
        console.log('requestWeatherData:have');
        this.weather_data = data.info;
        this.updeWeather();
      } else {
        /* eslint-disable no-console */
        console.log('requestWeatherData:haveno');
        let needFetch = true;
        const query = Bmob.Query('WeatherInfo');
        query.equalTo('city', '==', this.city);
        query.equalTo('createdAt', '>', `${this.formatDateString30min()}`);
        query.find().then((res) => {
          console.log('checkWeatherData then', res);
          if (res.length > 0) {
            needFetch = false;
            this.type = res[0].type;
            this.low = res[0].low;
            this.high = res[0].high;
            this.notice = res[0].notice;
            this.date = res[0].date;
            this.wendu = res[0].wendu;
            this.quality = res[0].quality ? res[0].quality : '中';
          }
          this.dealWeatherData(needFetch);
        }).catch((err) => {
          console.log('checkWeatherData catch', err);
          this.dealWeatherData(needFetch);
        });
      }
    },
    async dealWeatherData(needFetch = true) {
      if (needFetch) {
        console.log('fetch');
        const ret = await fetch({
          url: mAPI.weatherInfo,
          method: 'GET',
          data: {
            city: this.city
          }
        });
        this.weather_data = ret.data;
        this.weather_data.city = this.city;
        setStorage('WEATHER_KEY', {
          info: this.weather_data,
          time: (new Date()).getTime()
        });
        console.log('fetch Data', JSON.stringify(this.weather_data));
        const querySave = Bmob.Query('WeatherInfo');
        querySave.set('city', this.weather_data.city || ' ');
        querySave.set('type', this.weather_data.forecast[0].type || ' ');
        querySave.set('low', this.weather_data.forecast[0].low || ' ');
        querySave.set('high', this.weather_data.forecast[0].high || ' ');
        querySave.set('notice', this.weather_data.forecast[0].notice || ' ');
        querySave.set('date', this.weather_data.forecast[0].date || ' ');
        querySave.set('wendu', this.weather_data.wendu || ' ');
        querySave.set('quality', this.weather_data.quality || '中');
        querySave.save().then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        });
      }
      this.updeWeather();
    },
    updeWeather() {
      this.type = this.weather_data.forecast[0].type;
      this.low = this.weather_data.forecast[0].low;
      this.high = this.weather_data.forecast[0].high;
      this.notice = this.weather_data.forecast[0].notice;
      this.date = this.weather_data.forecast[0].date;
      this.wendu = this.weather_data.wendu;
      this.quality = this.weather_data.quality;
    },
    async getWeather() {
      await getStorage('WEATHER_KEY')
        .then((ret) => {
          if (((new Date()).getTime() - ret.time) > 10 * 60 * 1000) {
            return Promise.reject();
          }
          this.requestWeatherData(ret);
          return Promise.resolve();
        }).catch(() => {
          this.requestWeatherData();
        });
    },
    async getSystemInfo() {
      const sysInfo = await getSystemInfo();
      this.windowHeight = `${sysInfo.windowHeight}px`;
    }
  },
  created() {
    this.getWeather();
    this.getSystemInfo();
  },
  onPullDownRefresh() {
    this.getWeather();
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 2000);
  }
};
</script>

<style scoped>
.container_content {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.main {
  height: 100%;
  background: #7579FF;
}

.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}

.button {
  width: 80px;
  height: 80px;
  background: orange;
  color: white;
}

.function_01 {
  width: 165px;
  height: 50px;
  display: flex;
  color: #fff;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: linear-gradient(-180deg, #00CEF0 0%, #0AF388 100%);
  border-radius: 100px;
}

.function_02 {
  width: 165px;
  height: 50px;
  display: flex;
  color: #fff;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: linear-gradient(-179deg, #F5576C 0%, #F277B9 100%);
  border-radius: 100px;
}
</style>
