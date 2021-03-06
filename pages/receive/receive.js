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
    limitTime: 0,
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
            //self.viewMsg();
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
            if (r.type == r2.type && r2.data) {
              r.data = r2.data;
              if (r.type == 'second_limit' && !isNaN(r2.data) && r2.data > 0) {
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
    if (self.data.can_read || self.data.is_mine) {
      wx.showLoading();
      wx.onUserCaptureScreen(function (res) {
        api.captureScreen(self.msgId, self.token, function(resp) {
          var message = '请不要截图！违规3次后将不能再查看消息';
          if (resp.code == 0 && resp.message){
            message = resp.message;
          }
            wx.showModal({
              title: '警告',
              content: message,
              showCancel: false
            });
        });
      });
      api.getMsgDetail(self.msgId, self.token, function(resp) {
        if (resp.code == 0) {
          var limitTime = self.data.limitTime;
          if (self.data.is_mine) {
            limitTime = 0;
          }
          self.setData({
            status: 1,
            content: resp.data.content,
            limitTime: limitTime
          });

          if (limitTime > 0) {
            self.countDown();
          }
        }
      });
    } else {
      this.setData({
        status: 2
      });
    }
  },
  countDown: function () {
    var self = this;
    var limitTime = self.data.limitTime;
    var intervalId = setInterval(function () {
      limitTime = limitTime - 1;
      self.setData({
        limitTime: limitTime
      });
      if (limitTime <= 0) {
        clearInterval(intervalId);
        self.setData({
          status: 2
        });
      }
    }, 1000);
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
