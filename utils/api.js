var login = function (code, callback) {
  return new Promise((resolve, reject) => {
    var data = {code: code};
    // wx.request({
    //   method: 'POST',
    //   url: 'https://f0f82fa6-b768-475b-b861-01f9a4f55b79.mock.pstmn.io/api/user/login',
    //   data: JSON.stringify(data),
    //   header: {
    //     TOKEN: 'asdasd'
    //   },
    //   success: function (resp) {
    //     callback && callback(resp);
    //     resolve && resolve(resp);
    //   }
    // });

    console.log('==login== ', data);
    var resp = {
      code: 0,
      message: 'ok',
      data: {
        token: 'aabbcc'
      }
    };
    callback && callback(resp);
    resolve && resolve(resp);
  });
};

var getMsgOutLine = function (id, token, callback) {
  console.log('==getMsgOutLine== ', 'id: ' + id + ', token: ' + token);
  return new Promise((resolve, reject) => {
    var resp = {
      code: 0,
      message: "OK",
      data: {
        user: {
          nickname: "abc",
          headimgurl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553350453813&di=af38385d455ec29b3073b8a61fad1c20&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201507%2F09%2F20150709103047_3G8k4.jpeg"
        },
        time: "2019-02-30",
        is_mine: false,
        can_read: true,
        reason: "该消息已经销毁",
        rules: ['查看次数：1次', '查看人数：无限制', '查看时长：无限制', '截至日期：无限制']
      }
    };
    setTimeout(function() {
      callback && callback(resp);
      resolve && resolve(resp);
    }, 200);
  });
};
var getMsgDetail = function (id, token, callback) {
  console.log('==getMsgDetail== ', 'id: ' + id + ', token: ' + token);
  return new Promise((resolve, reject) => {
    var resp = {
      code: 0,
      message: "OK",
      data: {
        content: [
          {
            type: "text",
            data: "这里是文字内容，以后可能图文并茂"
          }
        ]
      }
    };
    callback && callback(resp);
    resolve && resolve(resp);
  });
};
var sendMsg = function (msg, token, callback) {
  var data = {
    content: [
      {
        type: 'text',
        data: msg
      }
    ]
  };
  console.log('==sendMsg== token: ' + token, data);
  console.log(JSON.stringify(data));
  return new Promise((resolve, reject) => {
    var resp = {
      code: 0,
      message: 'ok',
      data: {
        id: '3'
      }
    };
    callback && callback(resp);
    resolve && resolve(resp);
  });
};

module.exports = {
  login: login,
  getMsgOutLine: getMsgOutLine,
  getMsgDetail: getMsgDetail,
  sendMsg: sendMsg
}