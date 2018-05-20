<template>
  <div class="content">
    <div class="content_01">
      <div style="display: flex;flex-direction: row;width: 80px;margin-top: 5px;">
        <img :src="'../../static/imgs/location.png'" style="width:40.5rpx;height:46.3rpx;margin-left:10rpx;" />
        <p class="city">{{city}}</p>   
      </div> 
      <p class="date">{{date}}</p>
      <p class="type">空气质量: {{quality}}</p>          
    </div>
    <div style="display: flex;flex-direction: row;align-items: center;width: 100%;margin-top: 5px;">
      <p class="temp">{{wendu}}℃</p>    
      <p class="state">{{type}}</p>
    </div>    
    <p class="notice">{{notice}}</p>
    <div class="content_02">
      <p class="lowhigh">{{low}}/{{high}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    city: '',
    type: '',
    date: '',
    quality: '',
    wendu: 0,
    low: 0,
    high: 0,
    notice: '',
  }
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  width: 95%;
  max-width: 500px;
  color: #564EA4;
  background: #fff;
  margin-top: 30px;
  border-radius: 10px;
  box-shadow: 2px 2px 1px #ccc;
  opacity: 0.9;
}
.content_01 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.content_02 {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  margin-bottom: 5px;
  margin-top: 5px;
}
.content_03 {
  display: flex;
  flex-direction: row;
  margin-left: 5px;  
  width: 100%;
}
.state_box {
  display: flex;
  margin-bottom: 5dp;
  flex-direction: column;
  align-items: center;
}
.city {
  font-weight: bold;
  margin-left: 5px;  
  font-size: 20px;
}
.temp {
  font-weight: bold;
  margin-left: 5px;  
  font-size: 60px;
}
.lowhigh {
  font-size: 12px;
}
.type {
  margin-top: 5px;  
  margin-left: 10px;
  margin-right: 10px;
  font-size: 16px;
}
.state {
  font-weight: bold;  
  margin-top: 5px;  
  margin-left: 10px;
  margin-right: 10px;
  font-size: 30px;
}
.date {
  margin-top: 5px;
  margin-left: 5px;  
  font-size: 15px;
}
.notice {
  margin-left: 10px;
  font-size: 13px;
}
</style>
