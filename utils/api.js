var urlPrefix = 'https://message.hoka.net.cn';
var apiUrl = {
  login: urlPrefix + '/api/user/login',
  getMsgOutLine: urlPrefix + '/api/message/detail',
  getMsgDetail: urlPrefix + '/api/message/content',
  sendMsg: urlPrefix + '/api/message/add',
  uploadImg: urlPrefix + '/api/message/upload',
  getReadList: urlPrefix + '/api/message/read_list',
  getSendList: urlPrefix + '/api/message/send_list',
  report: urlPrefix + '/api/message/report',
  captureScreen: urlPrefix + '/api/message/capture_screen'
};

var ajax = function (method, url, data, header, callback) {
  if (!method) {
    method = 'GET';
  }
  if (!url) {
    return;
  }
  if (!data) {
    data = {};
  }
  if (!header) {
    header = {};
  }
  return new Promise((resolve, reject) => {
    console.log(url);
    console.log(data, header);
    wx.request({
      method: method,
      url: url,
      data: JSON.stringify(data),
      header: header,
      success: function (resp) {
        wx.hideLoading();
        console.log('success: ', resp);
        if (resp.data.code != 0) {
          wx.showModal({
            content: resp.data.message || '服务器出错',
            showCancel: false
          });
        }
        callback && callback(resp.data);
        resolve && resolve(resp.data);
      },
      fail: function (resp) {
        wx.hideLoading();
        console.log('fail: ', resp);
        wx.showModal({
          content: '网络错误',
          showCancel: false
        });
      }
    });
  });
};

var doPost = function (url, data, header, callback) {
  return ajax('POST', url, data, header, callback);
};

var doGet = function (url, header, callback) {
  return ajax('GET', url, null, header, callback);
}

var login = function (code, userInfo, callback) {
  var data = {
    code: code,
    userInfo: userInfo
  }
  return doPost(apiUrl.login, data, null, callback);
};

var getMsgOutLine = function (id, token, callback) {
  var url = apiUrl.getMsgOutLine + '?id=' + id;
  var header = {
    TOKEN: token
  };
  return doGet(url, header, callback);
};
var getMsgDetail = function (id, token, callback) {
  var url = apiUrl.getMsgDetail + '?id=' + id;
  var header = {
    TOKEN: token
  };
  return doGet(url, header, callback);
};
var sendMsg = function (param, token, callback) {
  var header = {
    TOKEN: token
  };
  return doPost(apiUrl.sendMsg, param, header, callback);
};

var uploadImg = function (filePath, token, callback) {
  wx.uploadFile({
    url: apiUrl.uploadImg,
    filePath: filePath,
    name: 'image',
    header: {
      TOKEN: token
    },
    success: function(resp) {
      wx.hideLoading();
      console.log('success: ', resp);
      let data = resp.data;
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      callback && callback(data);
    },
    fail: function(resp) {
      wx.hideLoading();
      console.log('fail: ', resp);
      wx.showModal({
        content: '上传出错',
        showCancel: false
      });
    }
  });
};

var getReadList = function (page, token, callback) {
  var url = apiUrl.getReadList + '?page=' + page;
  var header = {
    TOKEN: token
  };
  return doGet(url, header, callback);
};

var getSendList = function (page, token, callback) {
  var url = apiUrl.getSendList + '?page=' + page;
  var header = {
    TOKEN: token
  };
  return doGet(url, header, callback);
};

var report = function (type, token, callback) {
  var data = {
    type: type
  };
  var header = {
    TOKEN: token
  };
  return doPost(apiUrl.report, data, header, callback);
};

var captureScreen = function (msgId, token, callback) {
  var data = {
    message_id: msgId
  };
  var header = {
    TOKEN: token
  };
  return doPost(apiUrl.captureScreen, data, header, callback);
};

module.exports = {
  login: login,
  getMsgOutLine: getMsgOutLine,
  getMsgDetail: getMsgDetail,
  sendMsg: sendMsg,
  uploadImg: uploadImg,
  getReadList: getReadList,
  getSendList: getSendList,
  report: report,
  captureScreen: captureScreen
}