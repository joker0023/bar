const app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    status: -2,
    avatar: '/image/avatar.jpg',
    nick: '',
    tabType: 1,
    readPage: 0,
    sendPage: 0,
    readList: [],
    sendList: []
  },
  onLoad: function () {
    var self = this;
    app.login(function (resp) {
      if (resp.code == 0) {
        self.token = resp.token;
        self.setData({
          status: 0,
          avatar: resp.userInfo.avatarUrl,
          nick: resp.userInfo.nickName
        });
        self.loadReadList();
        self.loadSendList();
      }
    });
  },
  onShareAppMessage: function (resp) {
    var self = this;
    return {
      title: '重要信息',
      path: '/pages/send/send',
      imageUrl: '/image/logo.png'
    };
  },
  getUserInfo: function (resp) {
    app.setUserInfo(resp);
    this.onLoad();
  },
  switchTab: function(e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      tabType: type
    });
  },
  toDetail: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../receive/receive?id=' + id
    });
  },
  loadReadList: function() {
    let self = this;
    var page = self.data.readPage;
    if (page < 0) {
      return;
    }
    page++;
    wx.showLoading();
    api.getReadList(page, self.token).then(res => {
      if (res.code == 0) {
        let list = res.data.list;
        if (!list || list.length == 0) {
          self.setData({
            readPage: -1
          });
        } else {
          let readList = self.data.readList;
          readList = readList.concat(list);
          self.setData({
            readPage: page,
            readList: readList
          });
        }
      }
    });
  },
  loadSendList: function() {
    let self = this;
    var page = self.data.sendPage;
    if (page < 0) {
      return;
    }
    page++;
    wx.showLoading();
    api.getSendList(page, self.token).then(res => {
      if (res.code == 0) {
        let list = res.data.list;
        if (!list || list.length == 0) {
          self.setData({
            sendPage: -1
          });
        } else {
          let sendList = self.data.sendList;
          sendList = sendList.concat(list);
          self.setData({
            sendPage: page,
            sendList: sendList
          });
        }
      }
    });
  },
  showMoreReadList: function() {
    var self = this;
    self.loadReadList();
  },
  showMoreSendList: function() {
    var self = this;
    self.loadSendList();
  }
});