const app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    avatar: '/image/avatar.jpg',
    nick: '',
    time: '',
    content: [],
    status: -2,
    can_read: false,
    reason: '该消息已经销毁',
    rules: []
  },
  onLoad: function (option) {
    var self = this;
    self.msgId = option.id;
    app.getToken(function (token) {
      self.token = token;
      app.checkAndGetUserInfo(function (userInfo) {
        if (!userInfo) {
          self.setData({
            status: -1
          });
          return;
        }
        self.getMsgOutLine();
      });
    });
  },
  getMsgOutLine: function() {
    var self = this;
    api.getMsgOutLine(self.msgId, self.token, function (resp) {
      if (resp.code == 0) {
        self.setData({
          status: 0,
          avatar: resp.data.user.headimgurl,
          nick: resp.data.user.nickname,
          time: resp.data.time,
          can_read: resp.data.can_read,
          reason: resp.data.reason,
          rules: resp.data.rules
        });
      }
    });
  },
  viewMsg: function () {
    var self = this;
    if (self.data.can_read) {
      api.getMsgDetail(self.msgId, self.token, function(resp) {
        if (resp.code == 0) {
          self.setData({
            status: 1,
            content: resp.data.content
          });
        }
      });
    } else {
      this.setData({
        status: 2
      });
    }
    
  },
  toSendPage: function () {
    wx.navigateTo({
      url: '../send/send'
    })
  },
  getUserInfo: function (resp) {
    if (app.setUserInfo(resp)) {
      this.getMsgOutLine();
    }
  },
  onShareAppMessage: function () {
    var self = this;
    return {
      title: 'read-burn',
      path: '/pages/receive/receive?id=' + self.msgId,
      imageUrl: '/image/bar.png'
    };
  }
  
})
