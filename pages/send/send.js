const app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    status: -2,
    avatar: '/image/avatar.jpg',
    nick: '',
    textMsg: '',
    textMsgError: '',
    content: [],
    rule: {
      reading_amount: {
        unvalid: '',
        error: ''
      },
      second_limit: {
        unvalid: 'unvalid',
        error: ''
      },
      user_limit: {
        unvalid: 'unvalid',
        error: ''
      }
    }
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
  addTextMsg: function (e) {
    var msg = e.detail.value.message;
    if (!msg || !msg.trim()) {
      return;
    }
    var content = this.data.content;
    content.push({
      type: 'text',
      data: msg
    });
    this.setData({
      content: content,
      textMsg: '',
      textMsgError: ''
    });
  },
  addImgMsg: function () {
    var self = this;
    wx.chooseImage({
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        wx.showLoading();
        api.uploadImg(tempFilePaths[0], self.token, function(data) {
          if (data.code == 0) {
            let content = self.data.content;
            content.push({
              type: 'image',
              data: data.data.url,
              src: tempFilePaths[0]
            });
            self.setData({
              content: content
            });
          }
        });
      }
    });
  },
  checkTap: function (params) {
    var id = params.target.id;
    var value = params.detail.value;
    var rule = this.data.rule;
    if (value.length == 0) {
      rule[id].unvalid = 'unvalid';
    } else {
      rule[id].unvalid = '';
    }
    this.setData({
      rule: rule
    });
  },
  sendMsg: function (e) {
    var self = this;
   
    if (self.data.content.length == 0) {
      self.setData({
        textMsgError: 'error'
      });
      self.resetErrorStyle();
      return;
    }

    let value = e.detail.value;
    let rule = self.data.rule;
    rule.reading_amount.error = '';
    rule.second_limit.error = '';
    rule.user_limit.error = '';
    let ruleObj = [];
    let ruleIds = ['reading_amount', 'second_limit', 'user_limit'];
    for (var i = 0; i < ruleIds.length; i++) {
      let ruleId = ruleIds[i];
      if (!rule[ruleId].unvalid) {
        //有勾选
        let checkValue = value[ruleId];
        if (!checkValue || !checkValue.trim() || isNaN(checkValue)) {
          rule[ruleId].error = 'error';
          self.setData({
            rule: rule,
            textMsgError: ''
          });
          self.resetErrorStyle();
          return;
        }
        ruleObj.push({
          type: ruleId,
          data: checkValue
        });
      }
    }
   
    self.setData({
      rule: rule,
      textMsgError: ''
    });
   
    if (!self.token) {
      wx.showModal({
        content: '登录超时!',
        showCancel: false
      });
      return;
    }

    let sendObj = {
      content: self.data.content,
      rules: ruleObj
    };

    api.sendMsg(sendObj, self.token, function(resp) {
      if (resp.code == 0) {
        self.msgId = resp.data.id;
        self.setData({
          status: 1
        });
      }
    });
  },
  resetErrorStyle: function () {
    let self = this;
    setTimeout(function () {
      let rule = self.data.rule;
      rule.reading_amount.error = '';
      rule.second_limit.error = '';
      rule.user_limit.error = '';
      self.setData({
        rule: rule,
        textMsgError: ''
      });
    }, 1500);
  },
  getUserInfo: function (resp) {
    app.setUserInfo(resp);
    this.onLoad();
  },
  sendAgain: function () {
    this.msgId = '';
    var rule = this.data.rule;
    rule.reading_amount.unvalid = '';
    rule.second_limit.unvalid = 'unvalid';
    rule.user_limit.unvalid = 'unvalid';
    this.setData({
      status: 0,
      textMsg: '',
      content: [],
      rule: rule
    });
  }

})