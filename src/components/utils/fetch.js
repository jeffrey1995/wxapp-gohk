import { channel } from './constants';

import {
  getStorage,
  setStorage,
  getLocation,
  request
} from './wx';

const Alert = (content) => {
  wx.showModal({
    title: '',
    content,
    showCancel: false
  });
};

/**
 *@name getLBS
 *@description 获取用户LBS，缓存起来，缓存时间10分钟
 */
async function getLBS() {
  let latitude = 999;
  let longitude = 999;
  try {
    return await getStorage('ENV_LBS')
      .then((lbs) => {
        if (((new Date()).getTime() - lbs.data.time) > 10 * 60 * 1000) {
          return Promise.reject();
        }
        return {
          latitude: lbs.data.latitude,
          longitude: lbs.data.longitude
        };
      }).catch(() => getLocation().then((lbs) => {
        const data = {
          latitude: lbs.latitude,
          longitude: lbs.longitude,
          time: (new Date()).getTime()
        };
        setStorage('ENV_LBS', data);
        return {
          latitude: lbs.latitude,
          longitude: lbs.longitude
        };
      }));
  } catch (err) {
    latitude = -999;
    longitude = -999;
  }
  return { latitude, longitude };
}

/**
 *@name fetch
 *@description fetch
 *@property {string} options.url 请求URL
 *@property {Object,string} options.data 请求参数
 *@property {string} options.method 请求方法
 *@property {Function} options.success 返回成功
 *@property {Function} options.fail 返回失败
 */
async function fetch(options = { header: {} }) {
  let cookie = '';
  try {
    cookie = await getStorage('cookie');
  } catch (err) {
    cookie = '';
  }
  const lbs = await getLBS();
  const EnvParams = { channel, appType: 'H5', ...lbs };
  options.header = {
    ...options.header,
    cookie,
    EnvParams: JSON.stringify(EnvParams),
    'content-type': 'application/x-www-form-urlencoded'
  };

  // GET ：签名与数据放在一起；POST ：签名放在 URL 的查询字符串中
  if ((options.method || 'GET').toUpperCase() === 'GET') {
    options.data = {
      ...options.data,
    };
  } else {
    options.url = `${options.url}`;
  }

  const { autoLoading = false, autoToast = true } = options;
  if (autoLoading) {
    wx.showToast({ title: '处理中...', icon: 'loading', duration: 20000 });
  }

  const showError = (res = {}) => {
    if (autoToast) {
      const errMsg = res.errMsg || (res.tips && res.tips.content) || '系统错误，请稍后再试';
      Alert(errMsg);
    }
  };

  return request(options).then((res) => {
    wx.hideToast();
    // const statusCode = parseInt(res.statusCode || res.status, 10);
    // if (statusCode === 200) {
    return Promise.resolve(res.data);
    // }
    // showError(res.data || res);
    // return Promise.reject(res.data || res);
  }, (e) => {
    wx.hideToast();
    showError(e);
  });
}

export default options => fetch(options)
  .then(res => res,
        res => (res === 401 ? fetch(options) : Promise.reject(res)));
