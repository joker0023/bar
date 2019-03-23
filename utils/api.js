var urlPrefix = 'http://www.exiangjian.cn/mimixinxi/public/index.php';
var apiUrl = {
  login: urlPrefix + '/api/user/login',
  getMsgOutLine: urlPrefix + '/api/message/detail',
  getMsgDetail: urlPrefix + '/api/message/content',
  sendMsg: urlPrefix + '/api/message/add'
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
    wx.request({
      method: method,
      url: url,
      data: JSON.stringify(data),
      header: header,
      success: function (resp) {
        console.log('success: ', resp);
        callback && callback(resp.data);
        resolve && resolve(resp.data);
      },
      fail: function (resp) {
        console.log('fail: ', resp);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
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

var login = function (code, callback) {
  var data = { code: code };
  console.log('==login== ', data);
  return doPost(apiUrl.login, data, null, callback);
  // callback({
  //   code: 0,
  //   data: {token: 'aabbcc'}
  // });
};

var getMsgOutLine = function (id, token, callback) {
  console.log('==getMsgOutLine== ', 'id: ' + id + ', token: ' + token);
  var url = apiUrl.getMsgOutLine + '?id=' + id;
  var header = {
    TOKEN: token
  };
  return doGet(url, header, callback);
};
var getMsgDetail = function (id, token, callback) {
  console.log('==getMsgDetail== ', 'id: ' + id + ', token: ' + token);
  var url = apiUrl.getMsgDetail + '?id=' + id;
  var header = {
    TOKEN: token
  };
  return doGet(url, header, callback);
};
var sendMsg = function (msg, token, callback) {
  var header = {
    TOKEN: token
  };
  var data = {
    content: [
      {
        type: 'text',
        data: msg
      }
    ]
  };
  console.log('==sendMsg== token: ' + token, data);
  return doPost(apiUrl.sendMsg, data, header, callback);
};

module.exports = {
  login: login,
  getMsgOutLine: getMsgOutLine,
  getMsgDetail: getMsgDetail,
  sendMsg: sendMsg
}