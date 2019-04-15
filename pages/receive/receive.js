const app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    avatar: '/image/avatar.jpg',
    nick: '',
    time: '',
    content: [],
    status: -2,
    is_mine: false,
    can_read: false,
    limitTime: 10,
    reason: '该消息已经销毁',
    reported: false,
    rules: [
      {
        "type": "reading_amount",
        "data": "无限制"
      },
      {
        "type": "second_limit",
        "data": "无限制"
      },
      {
        "type": "user_limit",
        "data": "无限制"
      }
    ]
  },
  onLoad: function (option) {
    console.log('option: ', option);
    var self = this;
    self.setData({
      status: -2
    });
    self.option = option;
    self.msgId = option.id;
    app.login(function (resp) {
      if (resp.code == 0) {
        self.token = resp.token;
        self.getMsgOutLine(function(data) {
          if(data.is_mine) {
            self.viewMsg();
          }
        });
      } else {
        self.setData({
          status: -1
        });
      }
    });
  },
  getMsgOutLine: function(callBack) {
    var self = this;
    api.getMsgOutLine(self.msgId, self.token, function (resp) {
      if (resp.code == 0) {
        var reason = resp.data.reason;
        if (!reason) {
          reason = self.data.reason;
        }
        let rules = self.data.rules;
        let limitTime = self.data.limitTime;
        rules.forEach(r => {
          resp.data.rules.forEach(r2 => {
            if (r.type == r2.type) {
              r.data = r2.data;
              if (r.type == 'second_limit' && !isNaN(r2.data)) {
                limitTime = parseInt(r2.data);
              }
            }
          });
        });
        self.setData({
          status: 0,
          avatar: resp.data.user.avatar,
          nick: resp.data.user.nickname,
          time: resp.data.time,
          is_mine: resp.data.is_mine,
          can_read: resp.data.can_read,
          rules: rules,
          reason: reason,
          limitTime: limitTime
        });
        callBack && callBack(resp.data);
      }
    });
  },
  viewMsg: function () {
    var self = this;
    if (self.data.can_read) {
      wx.showLoading();
      wx.onUserCaptureScreen(function (res) {
        wx.showModal({
          title: '警告',
          content: '此页面不允许截屏，达到三次将被拉入黑名单!',
          showCancel: false
        });
        api.captureScreen(self.msgId, self.token);
      });
      api.getMsgDetail(self.msgId, self.token, function(resp) {
        if (resp.code == 0) {
          self.setData({
            status: 1,
            content: resp.data.content
          });
          if(self.data.is_mine) {
            return;
          }

          var limitTime = self.data.limitTime;
          var intervalId = setInterval(function () {
            limitTime = limitTime - 1;
            const animation = wx.createAnimation({
              duration: 500
            });
            animation.opacity(1).step().opacity(0.1).step();
            self.setData({
              limitTime: limitTime,
              timeAnimation: animation.export()
            });
            if (limitTime <= 0) {
              clearInterval(intervalId);
              self.setData({
                status: 2
              });
            }
          }, 1000);
        }
      });
    } else {
      this.setData({
        status: 2
      });
    }
  },
  toSendPage: function () {
    wx.switchTab({
      url: '../send/send'
    });
  },
  getUserInfo: function (resp) {
    app.setUserInfo(resp);
    this.onLoad(this.option);
  },
  onShareAppMessage: function () {
    var self = this;
    return {
      title: self.data.nick + '向你发了条重要信息，点击查看',
      path: '/pages/receive/receive?id=' + self.msgId,
      imageUrl: '/image/logo.png'
    };
  },
  showReport: function () {
    this.setData({
      showReport: true
    });
  },
  hideReport: function () {
    this.setData({
      showReport: false
    });
  },
  submitReport: function (data) {
    var self = this;
    let reportType = data.detail.value.reportType;
    if (!reportType) {
      return;
    }
    api.report(reportType, self.token);
    self.setData({
      reported: true,
      showReport: false
    });
    wx.showToast({
      title: '提交成功',
    })
  }
})
