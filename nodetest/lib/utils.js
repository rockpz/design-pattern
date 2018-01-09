var php = require('phpjs');

exports.parseInt = function (val) {
    return parseInt(val) || 0;
};

exports.next = function (arr, now) {
    now = Number(now);
    if (isNaN(now)) {
        return false;
    }

    if (!Array.isArray(arr)) {
        return false;
    }
    arr = arr.sort(function (p, n) {//升序
        return p - n;
    });
    for (var i in arr) {
        var arrI = Number(arr[i]);
        if (!isNaN(arrI) && arrI > now) {
            return arrI;
        }
    }
    return Number(arr[0]);

};

exports.invokeCallback = function (cb) {
    if (cb && typeof cb === 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};

exports.now = function () {
    return Math.floor(Date.now() / 1000);
}

exports.midNight = function (time) {
    if (time) {
        var now = new Date(time * 1000);
    } else {
        var now = new Date();
    }
    return Math.floor(now.getTime() / 1000) - (now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds());
};

/**
 * 当前时区的天数奇偶
 * @returns {number}
 */
exports.getTodayOddCheck = function (nowDate) {
    if (nowDate) {
        var now = nowDate;
    } else {
        var now = new Date();
    }
    return Math.floor((now.getTime() + (-now.getTimezoneOffset() * 60 * 1000)) / (24 * 60 * 60 * 1000)) % 2;
}

exports.isVIP = function (level, lifetime) {
    if (level <= 0) {
        return false;
    }
    return lifetime > Math.floor(Date.now() / 1000);
}

exports.isChuKong = function (appid) {
    if (!appid) {
        return false;
    }
    return appid >= 2100 && appid < 2300;
}

// exports._ = require('underscore');
exports._ = require('lodash');

exports.dateFormat = function (formatStr, time, milli) {	//日期函数
    var d = null;
    if (time) {
        d = new Date(time * 1000);
    } else if (milli) {//如果是毫秒
        d = new Date(milli);
    } else {
        d = new Date();
    }

    var year = d.getYear() + 1900;
    formatStr = formatStr.replace('Y', year);
    formatStr = formatStr.replace('y', (year + '').substr(-2));
    formatStr = formatStr.replace('m', ('0' + (d.getMonth() + 1)).substr(-2));
    formatStr = formatStr.replace('d', ('0' + d.getDate()).substr(-2));

    var hour = d.getHours();
    formatStr = formatStr.replace('H', ('0' + hour).substr(-2));
    formatStr = formatStr.replace('h', ('0' + ((hour | 0) % 12 || 12)).substr(-2));

    //上下午
    formatStr = formatStr.replace('a', hour < 12 ? 'am' : 'pm');

    formatStr = formatStr.replace('i', ('0' + d.getMinutes()).substr(-2));
    formatStr = formatStr.replace('s', ('0' + d.getSeconds()).substr(-2));
    return formatStr;
};

/**
 * 添加热更新支持
 * @param md
 * @param newPro
 * @param remoteModule
 */
exports.resetFunc = function (md, newPro, filename, remoteName) {
    global.my_cache = global.my_cache || {};

    if (!global.my_cache[filename] && !remoteName) {//远程模块的接口会被拷贝一份，存了没用
        var old = md.exports;
        md.exports = function (app) {
            var output = old.call(this, app);
            global.my_cache[filename] = output;
            return output;
        }
    }

    if (!global.my_cache[filename]) {//启动时
        if (remoteName) {
            global.my_cache[filename] = true;
        }
        return;
    }

    if (remoteName) {
        remoteName = filename.slice(filename.lastIndexOf('/') + 1, filename.lastIndexOf('.'))
    }

    if (!remoteName) {//不是远程
        if (global.my_cache && global.my_cache[filename]) {
            for (var property in newPro) {
                if (property && newPro[property] && typeof newPro[property] == 'function') {
                    global.my_cache[filename][property] = newPro[property];
                }
            }
        }
    } else {
        if (app.components['__remote__'].remote
            && app.components['__remote__'].remote.services.user
            && app.components['__remote__'].remote.services.user[remoteName]) {//rpc服务端的更新，客户端更新代码在reloadAll
            for (var property in newPro) {
                if (property) {
                    app.components['__remote__'].remote.services.user[remoteName][property] = newPro[property];
                }
            }
        }
    }
}

/**
 * 添加热更新支持 现在这样就不能有多个listener了
 * @param ex exports
 */
exports.resetEvent = function (ex) {
    for (var eventName in ex) {
        app.event.removeAllListeners(eventName);
        app.event.on(eventName, ex[eventName].bind(global.pomelo));
    }
}

var locks = {};
/**
 * 阻止未完成之前重复请求
 */
exports.lock = function (uid, lockName, content) {
    if (!locks[uid] || !locks[uid][lockName]) {
        locks[uid] = locks[uid] || {};
        locks[uid][lockName] = content || 1;
        return false;
    } else {
        return true;
    }
}

exports.setLock = function (uid, lockName, content) {
    locks[uid] = locks[uid] || {};
    locks[uid][lockName] = content || 1;
}

exports.getLock = function (uid, lockName) {
    return !!locks[uid] ? locks[uid][lockName] : 0;
}

exports.unlock = function (uid, lockName) {
    if (locks[uid] && locks[uid][lockName]) {
        delete locks[uid][lockName];
    }
}

exports.removeLock = function (uid) {
    if (locks[uid]) {
        delete locks[uid];
    }
}

exports.format = require('util').format;

// add, 20140430
exports.genUpicPath = function (user_upic_path, uid_prefix, uid, ext, upicid, sdKey) {
    var upicids = ['2', '3', '4', '5', '6', '7', '8'];

    var smallPath = user_upic_path + uid_prefix + '/' + uid;
    var bigPath   = user_upic_path + uid_prefix + '/origin/' + uid;

    if (sdKey == 'CN'){
        var time   = php.time();
        smallPath += '_' + time;
        bigPath   += '_' + time;
    }
    if (upicid && ~upicids.indexOf(upicid)) {
        return {
            small: smallPath + '-' + upicid + ext,
            origin: bigPath + '-' + upicid + ext
        };  
    } else {
        return {
            small: smallPath + ext,
            origin: bigPath + ext
        };
    }
};

/*
处理浮点类型乘法运算
 */
exports.accMul = function (arg1, arg2)
{
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{
        m+=s1.split(".")[1].length
    }
    catch(e){}
    try{
        m+=s2.split(".")[1].length
    }
    catch(e){}
    return Number(s1.replace(".","")) * Number(s2.replace(".","")) / Math.pow(10,m)
}

/*
处理浮点类型除法运算
 */
exports.accDiv = function (arg1, arg2){
    var t1 = 0,t2 = 0,r1,r2;
    try{
        t1 = arg1.toString().split(".")[1].length
    }catch(e){}
    try{
        t2 = arg2.toString().split(".")[1].length
    }catch(e){}
    with(Math){
        r1 = Number(arg1.toString().replace(".",""))
        r2 = Number(arg2.toString().replace(".",""))
        return (r1/r2) * pow(10,t2 - t1);
    }
}

/*
处理浮点类型加法运算
 */
exports.accAdd = function (arg1, arg2){
    var r1,r2,m;
    try{
        r1 = arg1.toString().split(".")[1].length
    }catch(e){
        r1 = 0
    }
    try{
        r2 = arg2.toString().split(".")[1].length
    }catch(e){
        r2 = 0
    }
    m = Math.pow(10,Math.max(r1,r2))
    return (arg1 * m + arg2 * m) / m
}

/**
 * 根据身份证号取相关信息
 * @param  {[type]} cardNo [description]
 * @return {[type]}        [description]
 */
exports.getIdCardInfo =function(cardNo) {
    var info = {
        isTrue : false,
        year : null,
        month : null,
        day : null,
        isMale : false,
        isFemale : false
    };
    if (!cardNo && 15 != cardNo.length && 18 != cardNo.length) {
        info.isTrue = false;
        return info;
    }
    if (15 == cardNo.length) {
        var year = cardNo.substring(6, 8);
        var month = cardNo.substring(8, 10);
        var day = cardNo.substring(10, 12);
        var p = cardNo.substring(14, 15); //性别位
        var birthday = new Date(year, parseFloat(month) - 1,
                parseFloat(day));
        // 对于老身份证中的年龄则不需考虑千年虫问题而使用getYear()方法  
        if (birthday.getYear() != parseFloat(year)
                || birthday.getMonth() != parseFloat(month) - 1
                || birthday.getDate() != parseFloat(day)) {
            info.isTrue = false;
        } else {
            info.isTrue = true;
            info.year = birthday.getFullYear();
            info.month = birthday.getMonth() + 1;
            info.day = birthday.getDate();
            if (p % 2 == 0) {
                info.isFemale = true;
                info.isMale = false;
            } else {
                info.isFemale = false;
                info.isMale = true
            }
        }
        return info;
    }
    if (18 == cardNo.length) {
        var year = cardNo.substring(6, 10);
        var month = cardNo.substring(10, 12);
        var day = cardNo.substring(12, 14);
        var p = cardNo.substring(14, 17)
        var birthday = new Date(year, parseFloat(month) - 1,
                parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题
        if (birthday.getFullYear() != parseFloat(year)
                || birthday.getMonth() != parseFloat(month) - 1
                || birthday.getDate() != parseFloat(day)) {
            info.isTrue = false;
            return info;
        }
        var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];// 加权因子  
        var Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];// 身份证验证位值.10代表X 
        // 验证校验位
        var sum = 0; // 声明加权求和变量
        var _cardNo = cardNo.split("");
        if (_cardNo[17].toLowerCase() == 'x') {
            _cardNo[17] = 10;// 将最后位为x的验证码替换为10方便后续操作  
        }
        for ( var i = 0; i < 17; i++) {
            sum += Wi[i] * _cardNo[i];// 加权求和  
        }
        var i = sum % 11;// 得到验证码所位置
        if (_cardNo[17] != Y[i]) {
            return info.isTrue = false;
        }
        info.isTrue = true;
        info.year = birthday.getFullYear();
        info.month = birthday.getMonth() + 1;
        info.day = birthday.getDate();
        if (p % 2 == 0) {
            info.isFemale = true;
            info.isMale = false;
        } else {
            info.isFemale = false;
            info.isMale = true
        }
        return info;
    }
    return info;
};