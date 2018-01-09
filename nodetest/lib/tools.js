/**
 * Created with JetBrains WebStorm.
 * User: zen
 * Date: 13-3-12
 * Time: 下午3:22
 * To change this template use File | Settings | File Templates.
 */
"use strict";

exports.format10000 = function(val) {
    if (val > 10000) return ''+Math.floor(val/10000)+'万';
    return ''+val;
}

exports.isEmail = function (email) {
    return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email);
};

exports.buildSig = function (paramKV, secureKey, joinSign, keyNeedJoin) {
    var self = global.doweb;
    var paramArr = exports.getSortedUrlFormatParams(paramKV);

    return app.model.zip.md5(paramArr.join(joinSign) + (keyNeedJoin ? joinSign : '') + secureKey);
};

exports.getSortedUrlFormatParams = function (paramKV) {
    var paramArr = [];
    for (var key in paramKV) {
        paramArr.push(key + '=' + paramKV[key]);
    }
    return paramArr.sort();
}

exports.buildSignByValue = function (paramKV, secureKey, joinSign, keyNeedJoin) {
    var self = global.doweb;
    var paramArr = [];
    for (var key in paramKV) {
        paramArr.push(key);
    }
    paramArr = paramArr.sort(function (a, b) {
        return a > b;
    });
    var valueArr = [];
    for (var i in paramArr) {
        if (paramKV[paramArr[i]]) {
            valueArr.push(paramKV[paramArr[i]]);
        }
    }
    var str = valueArr.join(joinSign) + (keyNeedJoin ? joinSign : '') + secureKey;
    return app.model.zip.md5(str);
}

// encode user name
exports.encodeUname = function (uname) {
    var realName = (uname + '').replace(/[系统|通知|系统通知|官方]/g, '*');
    return realName;
};

exports.decodeUname = function (uname) {
    var realName = uname;
    try {
        realName = decodeURIComponent(uname);
    } catch (err) {
        realName = unescape(uname);
    }
    realName = (realName + '').trim() || "*";
    // return realName.replace(/[系统|通知|系统通知|官方]/g, '*');
    return realName;
};

exports.price2Cent = function price2Cent(appid, price) {
    if (appid == 3) {
        return ~~(price / 100 * 6.1295 * 10);
    } else if (~['998', '2022'].indexOf(appid + '')) {
        return ~~(price / 100 * 10);
    } else {
        return ~~(price * 10);
    }
};
