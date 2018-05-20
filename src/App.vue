<script>
const Bmob = require('@/lib/app');

//  需填入Bmob应用的对应key
Bmob.initialize('', '');

export default {
  created() {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    /* eslint-disable no-console */
    console.log('app created and cache logs by setStorageSync');
  },
};
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: #fff
}
</style>
