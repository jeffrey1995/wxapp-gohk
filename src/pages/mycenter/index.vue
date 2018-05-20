<template>  
  <div class="container" style="justify-content: space-between;">
    <div class="index-header">
      <img class="userinfo-avatar" :src="[userInfo.avatarUrl?userInfo.avatarUrl:'../../static/imgs/ic_mc_user.png']" background-size="cover" />    
      <div class="userinfo-box">
        <p class="userinfo-wxname">{{nickName}}</p>
      </div>
    </div>
    <!-- <button class="button" style="margin: 10px">购物清单</button> -->
    <div class="container_tab">
      <div class="tab-title">
        <div class="tab-item">
          <div :class="[selected1?'border-tottom':'default']" @click="selected1Tap()">未完成清单</div>
        </div>
        <div class="tab-item">
          <div :class="[selected2?'border-tottom':'default']" @click="selected2Tap()">已完成清单</div>
        </div>
      </div>
    </div>           
    <div class="tab-content">
        <div :class="[selected1?'show':'hidden']" style="height:100%;width:100%;">
          <div class="section-input">
            <input type="text" class="form-control" v-model="input_text" placeholder="准备买点什么?"/>
            <button open-type="getUserInfo" type="primary" size="mini" @click="submit()" style="width:15%;font-size:18rpx;margin:5px">添加</button>
          </div> 
          <p class="text-tips" v-if="hasTips">请在上方的输入栏中输入需要购买的物品名称，然后点击"添加"即可，勾选项目可以将项目标记为已完成</p>
          <scroll-view scroll-y="true" style="height: 100%;width: 100%;">
            <ul v-for="(item, index) in list">
              <div v-if="item.state==1" class="item-box" @tap="itemClick(index)">
                <p class="item-title">{{item.title}}</p>
                <div class="item-right">
                  <checkbox-group @tap.stop="" @change="checkboxChange" style="margin:5rpx;align-self: flex-end;">
                    <checkbox :value="index"/>
                  </checkbox-group>
                  <p class="item-date">{{item.createdAt}}</p>
                </div>
              </div>
              <div v-if="item.state==1" style="width: 100%;height: 2px;background: #f3f3f3;" />              
            </ul>
          </scroll-view>
        </div>
        <div :class="[selected2?'show':'hidden']" style="height:100%">
          <scroll-view scroll-y="true" style="height: 90%" @scrolltolower="lower" lower-threshold="100" >
            <ul v-for="(item, index) in list">
              <div v-if="item.state==0" class="item-box" @click="itemClick(index)">
                <p class="item-title">{{item.title}}</p>          
                <div class="item-right" >
                  <checkbox-group @tap.stop="" @change="checkboxChange" style="margin:5rpx;align-self: flex-end;">
                    <checkbox :value="index" checked="true" disabled="true"/>
                  </checkbox-group>
                  <p class="item-date">{{item.createdAt}}</p>
                </div>
              </div>
              <div v-if="item.state==0" style="width: 100%;height: 2px;background: #f3f3f3;" />              
            </ul>
          </scroll-view>
        </div>
      </div>
  </div>
</template>

<script>
import { getStorage, setStorage } from '@/components/utils/wx';

const Bmob = require('@/lib/app');

export default {
  data: {
    canIUse: true,
    hasUserInfo: true,
    userInfo: {},
    openid: '',
    storageTime: 0,
    selected1: true,
    selected2: false,
    input_text: '',
    list: [],
    shoppingData: [],
    hasTips: true
  },
  computed: {
    nickName() {
      if (this.userInfo.nickName) {
        return this.userInfo.nickName;
      }
      return 'HelloWorld';
    }
  },
  watch: {
    shoppingData: {
      handler() {
        console.debug('shoppingData change');
        this.hasTips = true;
        this.list = this.shoppingData;
        this.list.forEach((element) => {
          if (element.state === '1') {
            this.hasTips = false;
          }
          if (element.title.length > 12) {
            element.title = `${element.title.substring(0, 12)}...`;
          }
        });
      },
    },
  },
  methods: {
    selected1Tap() {
      this.selected1 = true;
      this.selected2 = false;
    },
    selected2Tap() {
      this.selected2 = true;
      this.selected1 = false;
    },
    submit() {
      console.log('to submit');
      if (this.input_text) {
        if (this.openid) {
          const query = Bmob.Query('ShoppingList');
          query.set('openid', this.openid);
          query.set('title', this.input_text);
          query.set('state', '1');
          query.save().then((res) => {
            console.log('addShopList', res);
            this.getShoppingList();
            this.input_text = '';
          }).catch((error) => {
            console.log('Error', error.code, error.message);
          });
        } else {
          this.getUserInfo();
        }
      }
    },
    checkboxChange(e) {
      console.log('checkboxChange', e.mp.detail.value[0]);
      const query = Bmob.Query('ShoppingList');
      query.get(this.shoppingData[e.mp.detail.value[0]].objectId).then((res) => {
        console.log('ShoppingList', res);
        if (res) {
          let state;
          if (res.state === '0') {
            state = '1';
          } else {
            state = '0';
          }
          res.set('state', state);
          res.save().then((re) => {
            console.log('save:', re);
            this.shoppingData[e.mp.detail.value[0]].state = state;
            this.needShowTips();
          });
        }
      }).catch((error) => {
        console.log('Error', error.code, error.message);
      });
    },
    needShowTips() {
      this.hasTips = true;
      this.list.forEach((element) => {
        if (element.state === '1') {
          this.hasTips = false;
        }
      });
    },
    async getUserStorage() {
      await getStorage('USER_INFO')
        .then((ret) => {
          if (ret) {
            this.storageTime = ret.time;
            this.userInfo = ret.userInfo;
            this.openid = ret.openid;
          } else {
            this.getUserInfo();
          }
          return Promise.resolve();
        }).catch((err) => {
          /* eslint-disable no-console */
          console.log(err);
        });
    },
    getUserInfo() {
      wx.login({
        success: (res) => {
          if (res.code) {
            Bmob.User.requestOpenId(res.code).then((userData) => {
              wx.getUserInfo({
                success: (result) => {
                  const userInfo = result.userInfo;
                  const nickName = userInfo.nickName;
                  this.userInfo = result.userInfo;
                  this.openid = userData.openid;
                  this.getShoppingList();
                  setStorage('USER_INFO', {
                    userInfo: this.userInfo,
                    time: (new Date()).getTime(),
                    openid: userData.openid
                  });
                  //  判断是否已注册
                  const query = Bmob.Query('_User');
                  query.equalTo('openid', '==', userData.openid);
                  query.find().then((re) => {
                    if (re.length === 0) {
                      console.log('未注册', re);
                      const params = {
                        username: `${nickName + userData.openid}`,
                        password: userData.openid,
                        openid: userData.openid,
                        userData
                      };
                      Bmob.User.register(params).then((r) => {
                        console.log(r);
                      }).catch((err) => {
                        console.log(err);
                      });
                    } else {
                      console.log('已注册', re);
                    }
                  }).catch((e) => {
                    console.log(e);
                  });
                },
                fail: (e) => {
                  console.log('no userInfo', e);
                }
              });
            }).catch((error) => {
              console.log('Error', error.code, error.message);
            });
          }
        },
      });
    },
    checkSettingStatu() {
      wx.getSetting({
        success: (res) => {
          console.log('getSetting', res);
          const authSetting = res.authSetting;
          if (JSON.stringify(authSetting) === '{}') {
            console.log('首次授权');
            this.getUserInfo();
          } else {
            console.log('非首次授权');
            if (authSetting['scope.userInfo'] === false) {
              wx.showModal({
                title: '提示',
                content: '必须授权登录之后才能使用所有功能，是否重新授权？',
                success: (res0) => {
                  if (res0.confirm) {
                    console.log('用户点击确定');
                    wx.openSetting({
                      success: (r) => {
                        console.log('openSetting', r);
                      },
                      fail: (er) => {
                        console.log('openSetting', er);
                      }
                    });
                  } else if (res0.cancel) {
                    console.log('用户点击取消');
                  }
                }
              });
            } else {
              this.getUserInfo();
            }
          }
        }
      });
    },
    getShoppingList() {
      wx.showToast({ title: '处理中...', icon: 'loading', duration: 20000 });
      const query = Bmob.Query('ShoppingList');
      query.equalTo('openid', '==', this.openid);
      query.order('-createdAt');
      query.find().then((res) => {
        console.log('ShoppingList', res);
        this.shoppingData = res;
        wx.hideToast();
      }).catch((error) => {
        console.log('Error', error.code, error.message);
        wx.hideToast();
      });
    },
    itemClick(index) {
      //  跳转清单详情
      console.log('click:', index);
      wx.navigateTo({
        url: `../list_detail/main?openid=${this.openid}&objectId=${this.list[index].objectId}`
      });
    }
  },
  created() {
    // 调用应用实例的方法获取全局数据
  },
  async onShow() {
    console.log('onShow');
    this.checkSettingStatu();
  },
  onPullDownRefresh() {
    this.checkSettingStatu();
    // if (((new Date()).getTime() - this.storageTime) > 1 * 60 * 1000) {
    //   this.getUserInfo();
    // }
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 2000);
  }
};

</script>
<style>
.index-header {
  width: 100%;
  height: 172rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #7579FF;
}

.userinfo-avatar {
  width: 100rpx;
  height: 100rpx;
  margin-left: 50rpx;
  border-radius: 50%;
}

.userinfo-box {
  display: flex;
  margin-left: 20rpx;
  flex-direction: column;
  justify-content: center;
}

.userinfo-wxname {
  color: #ffffff;
  font-size: 30rpx;
}

.userinfo-phonenumber {
  color: #ffffff;
  font-size: 30rpx;
}

.button {
  background: #f39c12;
  color: white;
}

.container_tab {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.tab-title {
  width: 100%;
  height: 80rpx;
  line-height: 50rpx;
  display: flex;
  background: #fff;
  flex: row;
}

.tab-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tab-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.border-tottom {
  display: flex;
  height: 80rpx;
  width: 180rpx;
  color: #f39c12;
  font-size: 28rpx;
  justify-content: center;
  align-items: center;
  border-bottom: 1rpx solid #f39c12;
  background: white;
}

.default {
  display: flex;
  height: 100%;
  width: 180rpx;
  color: #808080;
  font-size: 28rpx;
  justify-content: center;
  align-items: center;
  background: white;
}

.show {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.hidden {
  display: none;
}

.item-box {
  height: 60px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.item-title {
  margin-left: 20px;
  font-size: 18px;
  align-self: center;
}

.item-date {
  margin-right: 10rpx;  
  font-size: 12px;
  align-self: flex-end;  
}

.section-input {
  height: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
}

.form-control {
  width: 85%;
  height: 100%;
  padding: 0 12px;
  margin: 5px;
  border-bottom: 1px solid #ccc;
}

.item-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.text-tips {
  font-size: 30rpx;
  color: #ccc;
  margin: 10px;
}
</style>
