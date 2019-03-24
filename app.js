const api = require('utils/api.js');

//app.js
App({
  onLaunch: function () {
    
  },
  globalData: {
    userInfo: null,
    token: null
  },
  login: function (callback) {
    var self = this;
    self.getUserInfo(function(userInfo) {
      if (userInfo) {
        self.getToken(userInfo, function(token) {
          var resp = {
            code: 0,
            userInfo: userInfo,
            token: token
          };
          callback && callback(resp);
        });
      } else {
        callback && callback({
          code: -1
        });
      }
    });
  },
  getToken: function (userInfo, callback) {
    var self = this;
    if (self.globalData.token) {
      callback && callback(self.globalData.token);
      return;
    }
    // 登录
    wx.login({
      success: res => {
        api.login(res.code, userInfo, function(result) {
          if (result.code == 0) {
            self.globalData.token = result.data.token;
            callback && callback(self.globalData.token);
          }
        });
      }
    });
  },
  getUserInfo: function (callback) {
    var self = this;
    if (self.globalData.userInfo) {
      callback && callback(self.globalData.userInfo);
      return;
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              self.globalData.userInfo = res.userInfo;
              callback && callback(res.userInfo);
            }
          });
        } else {
          callback && callback();
        }
      }
    });
  },
  setUserInfo: function (res) {
    if (res.detail.rawData) {
      this.globalData.userInfo = JSON.parse(res.detail.rawData);
      return this.globalData.userInfo;
    }
    return null;
  }
})