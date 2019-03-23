const api = require('utils/api.js');

//app.js
App({
  onLaunch: function () {
    
  },
  globalData: {
    userInfo: null,
    token: null
  },
  getToken: function (callback) {
    var self = this;
    if (self.globalData.token) {
      callback && callback(self.globalData.token);
      return;
    }
    // 登录
    wx.login({
      success: res => {
        api.login(res.code, function(result) {
          if (result.code == 0) {
            self.globalData.token = result.data.token;
            callback && callback(self.globalData.token);
          } else {
            wx.showToast({
              title: '登录失败',
              icon: 'none'
            });
          }
        });
      }
    });
  },
  checkAndGetUserInfo: function (callback) {
    var self = this;
    if (self.globalData.userInfo) {
      callback && callback(self.globalData.userInfo);
      return;
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          self.getUserInfo(callback);
        } else {
          callback && callback();
        }
      }
    });
  },
  getUserInfo: function (callback) {
    var self = this;
    wx.getUserInfo({
      success: res => {
        self.globalData.userInfo = res.userInfo;
        callback && callback(res.userInfo);
      }
    })
  },
  setUserInfo: function (res) {
    if (res.detail.rawData) {
      this.globalData.userInfo = JSON.parse(res.detail.rawData);
      return this.globalData.userInfo;
    }
    return null;
  }
})