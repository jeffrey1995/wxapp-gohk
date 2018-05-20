export const getStorage = theKey => new Promise((resolve, reject) => {
  wx.getStorage({
    key: theKey,
    success(res) {
      resolve(res.data);
    },
    fail(e) {
      reject(e);
    }
  });
});

export const setStorage = (theKey, theValue) => new Promise((resolve, reject) => {
  wx.setStorage({
    key: theKey,
    data: theValue,
    success() {
      resolve();
    },
    fail(e) {
      reject(e);
    }
  });
});

export const getLocation = () => new Promise((resolve) => {
  wx.getLocation({
    success({ latitude, longitude, speed, accuracy }) {
      resolve({ latitude, longitude, speed, accuracy });
    },
    fail() {
      resolve({
        latitude: -999,
        longitude: -999
      });
    }
  });
});

export const removeStorage = theKey => new Promise((resolve, reject) => {
  wx.removeStorage({
    key: theKey,
    success(res) {
      resolve(res.data);
    },
    fail(e) {
      reject(e);
    }
  });
});

export const clearStorage = () => new Promise((resolve, reject) => {
  try {
    wx.clearStorageSync();
    resolve();
  } catch (e) {
    reject(e);
  }
});

export const getSystemInfo = () => new Promise((resolve, reject) => {
  wx.getSystemInfo({
    success(res) {
      resolve(res);
    },
    fail(e) {
      reject(e);
    }
  });
});

export const login = () => new Promise((resolve, reject) => {
  wx.login({
    success(res) {
      resolve(res);
    },
    fail(e) {
      reject(e);
    }
  });
});

export const request = obj => new Promise((resolve, reject) => {
  wx.request({
    url: obj.url,
    data: obj.data,
    header: obj.header,
    method: obj.method,
    success(res) {
      resolve(res);
    },
    fail(e) {
      /* eslint-disable no-console */
      console.log(e);
      reject(e);
    }
  });
});

export default {
  getStorage,
  setStorage,
  getLocation,
  removeStorage,
  clearStorage,
  login,
  request
};
