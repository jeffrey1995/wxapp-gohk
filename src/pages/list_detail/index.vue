<template>  
  <div class="container">
    <div class="section-button">
      <button type="primary" size="mini"  @click="toSave()" style="margin: 5px">保存</button>
      <button type="primary" size="mini"  @click="toDelete()" style="margin: 5px">删除</button>
    </div>
    <p class="item-title">标题:</p>
    <div class="section-input">
      <input class="form-control" type="text" v-model="data.title" placeholder="请写入内容"/>
    </div>
    <p class="item-title" style="margin-top: 10px;">详情:</p>
    <div class="section-input">
      <textarea class="form-control" v-model="data.content" maxlength="-1" auto-height="true" type="text" placeholder="请写入内容"/>
    </div>
  </div>
</template>

<script>
import { getSystemInfo } from '@/components/utils/wx';

const Bmob = require('@/lib/app');

export default {
  data: {
    windowHeight: '500px',
    data: {},
    openid: '',
    objectId: '',
  },
  computed: {
  },
  methods: {
    async getSystemInfo() {
      const sysInfo = await getSystemInfo();
      this.windowHeight = `${sysInfo.windowHeight}px`;
    },
    toSave() {
      const query = Bmob.Query('ShoppingList');
      query.get(this.objectId).then((res) => {
        if (res) {
          if (this.data.title) {
            res.set('title', this.data.title);
          }
          if (this.data.content) {
            res.set('content', this.data.content);
          }
          res.save().then(() => {
            wx.navigateBack();
          });
        }
      }).catch((error) => {
        console.log('Error', error.code, error.message);
      });
    },
    toDelete() {
      const query = Bmob.Query('ShoppingList');
      query.get(this.objectId).then((res) => {
        if (res) {
          res.destroy().then(() => {
            wx.navigateBack();
          });
        }
      }).catch((error) => {
        console.log('Error', error.code, error.message);
      });
    }
  },
  created() {
    this.getSystemInfo();
  },
  async onLoad(options) {
    console.log('onLoad', options.openid, options.objectId);
    this.openid = options.openid;
    this.objectId = options.objectId;
    const query = Bmob.Query('ShoppingList');
    query.get(this.objectId).then((res) => {
      console.log('getData', res);
      if (res) {
        this.data = res;
      }
    }).catch((error) => {
      console.log('Error', error.code, error.message);
    });
  }

};

</script>
<style>
.form-control {
  width: 100%;
  height: 100%;
  padding: 5px;
  margin: 5px;
  border-bottom: 1px solid #ccc;
}

.section-input {
  height: auto;
  min-height: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
}

.section-button {
  align-self: flex-end;
  display: flex;
  flex-direction: row-reverse;
}

.item-title {
  align-self: flex-start;
  margin-left: 10px;
  font-weight: bold;
}
</style>
