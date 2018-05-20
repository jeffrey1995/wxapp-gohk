<template>  
  <div class="container">
    <button type="primary" size="mini"  @click="toMap()" style="margin: 5px">{{button}}</button>  
    <img v-if="state==0" class="subway-bg" :style="'width:100%;height: '+windowHeight" :src="'../../static/imgs/subway.jpg'"/>
    <map v-if="state==1" :style="'width:100%;height: '+windowHeight" show-location scale="14" :latitude="latitude" :longitude="longitude" :markers="markers"></map>  
  </div>
</template>

<script>
import { getSystemInfo, getLocation } from '@/components/utils/wx';

export default {
  data: {
    windowHeight: '500px',
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    button: '我的位置',
    state: 0
  },
  computed: {
  },
  methods: {
    async getSystemInfo() {
      const sysInfo = await getSystemInfo();
      this.windowHeight = `${sysInfo.windowHeight}px`;
    },
    async toMap() {
      if (this.state === 0) {
        this.state = 1;
        this.button = '地铁图';
        const lbs = await getLocation();
        this.latitude = lbs.latitude;
        this.longitude = lbs.longitude;
        this.markers.latitude = lbs.latitude;
        this.markers.longitude = lbs.longitude;
      } else {
        this.state = 0;
        this.button = '我的位置';
      }
    }
  },
  created() {
    this.getSystemInfo();
  }
};

</script>
<style>
.subway-bg {
  border-width: 1px;
  width: 100%;
}
</style>
