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
    rules: ['查看次数：1次', '查看人数：无限制', '查看时长：无限制', '截至日期：无限制']
  },
  onLoad: function (option) {
    var self = this;
    self.setData({
      status: -2
    });
    self.option = option;
    self.msgId = option.id;
    app.login(function (resp) {
      if (resp.code == 0) {
        self.token = resp.token;
        self.getMsgOutLine();
      } else {
        self.setData({
          status: -1
        });
      }
    });
  },
  getMsgOutLine: function() {
    var self = this;
    api.getMsgOutLine(self.msgId, self.token, function (resp) {
      if (resp.code == 0) {
        var reason = resp.data.reason;
        if (!reason) {
          reason = self.data.reason;
        }
        self.setData({
          status: 0,
          avatar: resp.data.user.avatar,
          nick: resp.data.user.nickname,
          time: resp.data.time,
          can_read: resp.data.can_read,
          // rules: resp.data.rules,
          reason: reason
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

          setTimeout(function() {
            self.setData({
              status: 2
            });
          }, 2000);
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
    app.setUserInfo(resp);
    this.onLoad(this.option);
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
