var urlPrefix = 'https://www.exiangjian.cn/mimixinxi/public/index.php';
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
        if (resp.data.code != 0) {
          wx.showToast({
            title: '服务器出错',
            icon: 'none'
          })
        }
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

var login = function (code, userInfo, callback) {
  var data = {
    code: code,
    userInfo: userInfo
  }
  console.log('==login== ', data);
  return doPost(apiUrl.login, data, null, callback);
};

var getMsgOutLine = function (id, token, callback) {
  console.log('==getMsgOutLine== ', 'id: ' + id + ', token: ' + token);
  var url = apiUrl.getMsgOutLine + '?id=' + id;
  var header = {
    TOKEN: token
  };
  return doGet(url, header, callback);
  // callback({
  //   code: 0,
  //   message: "OK",
  //   data: {
  //     user: {
  //       nickname: "abc",
  //       headimgurl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553350453813&di=af38385d455ec29b3073b8a61fad1c20&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201507%2F09%2F20150709103047_3G8k4.jpeg"
  //     },
  //     time: "2019-02-30",
  //     is_mine: false,
  //     can_read: false,
  //     reason: "该消息已经销毁",
  //     rules: ['查看次数：1次', '查看人数：无限制', '查看时长：无限制', '截至日期：无限制']
  //   }
  // });
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