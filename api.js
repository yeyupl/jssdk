var str = require('string')
var arr = require('array')
var url = require('url')
var util = require('util')

var config = {
    key: 'APP_KEY',
    prefix: 'PREFIX',
    secret: 'SECRET',
    url: 'https://oa.XXX.cn/server/'
}

var ts = parseInt(new Date().getTime() / 1000);

function get(app, api, data, callback) {
    data = getData(api, data)
    wx.request({
        url: config.url,
        data: data,
        success: function (res) {
            console.log(res)
            //token校验失败 退出登陆
            if (res.data.code <= -2) {
                app.logout()
            }
            callback(res)
        }
    })
}

function post(app, api, data, callback) {
    data = getData(api, data)
    wx.request({
        url: config.url,
        data: data,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
            console.log(res)
            //token校验失败 退出登陆
            if (res.data.code <= -2) {
                app.logout()
            }
            callback(res)
        }
    })
}

function getData(api, data) {
    if (!data) {
        data = {}
    }
    data.user_id = wx.getStorageSync('user_id')
    data.token = wx.getStorageSync('token')
    data.sign = createSign(api, data)
    data.api = api
    data.key = config.key
    data.ts = ts
    console.log(data)
    return data
}

function createSign(api, data) {
    data = arr.ksort(data);
    var paramsStr = util.md5(url.http_build_query(data));
    return util.md5(config.prefix + config.key + config.secret + api + ts + paramsStr);
}

function request(api, data, callback) {
    if (!data) {
        data = {}
    }
    data.api = api
    wx.request({
        url: config.url,
        data: data,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
            console.log(res)
            callback(res)
        }
    })
}

module.exports = {
    get: get,
    post: post,
    request: request
}