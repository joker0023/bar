const app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    status: -2,
    avatar: '/image/avatar.jpg',
    nick: ''
  },
  onLoad: function () {
    var self = this;
    self.setData({
      status: -2
    });
    app.login(function(resp) {
      if (resp.code == 0) {
        self.token = resp.token;
        self.setData({
          status: 0,
          avatar: resp.userInfo.avatarUrl,
          nick: resp.userInfo.nickName
        });
      } else {
        self.setData({
          status: -1
        });
      }
    });
  },
  onShareAppMessage: function (resp) {
    var self = this;
    if (resp.from === 'button') {
      return {
        title: self.data.nick + '向你发了条重要信息，点击查看',
        path: '/pages/receive/receive?id=' + self.msgId,
        imageUrl: '/image/logo.png'
      };
    } else {
      return {
        title: '重要信息',
        path: '/pages/send/send',
        imageUrl: '/image/logo.png'
      };
    }
  },
  sendMsg: function (e) {
    var self = this;
    var msg = e.detail.value.message;
    if (!msg) {
      return;
    }
    if (!self.token) {
      wx.showModal({
        content: '登录超时!',
        showCancel: false
      });
      return;
    }
    api.sendMsg(msg, self.token, function(resp) {
      if (resp.code == 0) {
        self.msgId = resp.data.id;
        self.setData({
          status: 1
        });
      }
    });
  },
  getUserInfo: function (resp) {
    app.setUserInfo(resp);
    this.onLoad();
  },
  sendAgain: function () {
    this.msgId = '';
    this.setData({
      status: 0,
    });
  }

})