"use strict"
var getTodayOddCheck = require(__dirname + '/../../shared/time.js').getTodayOddCheck;

//包装用户信息
exports.userInfo = function (userInfo, cb) {
    var self = global.doweb;
    cb = cb || function () {
    };
    var user = userInfo;
    var retUserInfo = {};
    getProfitH(userInfo.profit, function (isAvailable, profit_h) {
        if (isAvailable) {
            retUserInfo.profit_h = profit_h;
        }
    });//百手盈利

    retUserInfo.sessid = user.sessid;
    retUserInfo.sid = self.__.parseInt(user.sid);
    retUserInfo.siteuid = user.siteuid;
    if (user.token) {
        retUserInfo.token = user.token;
    }
    if (user.token_expire) {
        retUserInfo.token_expire = user.token_expire;
    }
    retUserInfo.status = self.__.parseInt(user.status);
    retUserInfo.uchips = self.__.parseInt(user.chips);
    retUserInfo.uid = self.__.parseInt(user.uid);
    retUserInfo.uname = L.uname(user.uname);
    retUserInfo.email = user.email || '';
    retUserInfo.buying = Math.abs(user.buying);
    retUserInfo.day_money = self.__.parseInt(user.day_money);
    retUserInfo.deviceid = user.deviceid;
    retUserInfo.exp = user.exp;
    retUserInfo.highcards = user.highcards;
    retUserInfo.isReLogin = user.isReLogin || false;
//    retUserInfo.is_day_login = user.is_day_login;
    retUserInfo.last_login = self.__.parseInt(user.last_login);
    retUserInfo.login_count = self.__.parseInt(user.login_count);
    retUserInfo.pay_count = self.__.parseInt(user.pay_count);
    retUserInfo.play_count = self.__.parseInt(user.play_count);
    retUserInfo.reg_time = self.__.parseInt(user.reg_time);
    retUserInfo.roomid = self.__.parseInt(user.roomId);
    retUserInfo.seatid = self.__.parseInt(user.seatId);
    retUserInfo.broke_count = self.__.parseInt(user.broke_count);
    retUserInfo.chips_max = Math.max(__.parseInt(user.chips_max), retUserInfo.uchips);//历史最大身家

    retUserInfo.money  = userInfo.money;
    retUserInfo.is_signed = !!userInfo.is_signed;

    retUserInfo.upic = user.upic || '';
    if (retUserInfo.upic) {
        retUserInfo.upic = app.model.tools.fixUpicUrl(retUserInfo.upic, __.parseInt(user.appid));
    } else {
        delete retUserInfo.upic;
    }
//    if (user.upic_L)retUserInfo.upic_L = user.upic_L;

    retUserInfo.usex = self.__.parseInt(user.usex);
    retUserInfo.viplevel = user.viplevel;
    retUserInfo.vip_lifetime = self.__.parseInt(user.vip_lifetime);
    retUserInfo.win_count = self.__.parseInt(user.win_count);
    retUserInfo.win_max = self.__.parseInt(user.win_max);
    retUserInfo.win_total = self.__.parseInt(user.win_total);

    retUserInfo.host = userInfo.host || userInfo.svr_host;
    retUserInfo.port = userInfo.port || userInfo.svr_port;
    if (!retUserInfo.host)delete retUserInfo.host;
    if (!retUserInfo.port)delete retUserInfo.port;

    cb(null, retUserInfo);
    return retUserInfo;
};

//处理排行榜中用户信息
exports.topUserInfo = function (userInfo, cb) {
    var self = global.doweb;
    cb = cb || function () {
    };
    var user = userInfo;
    var retUserInfo = {};

    retUserInfo.uid = self.__.parseInt(user.uid);
    retUserInfo.uname = L.uname(user.uname);
    retUserInfo.uchips = self.__.parseInt(user.chips);
    retUserInfo.upic = user.upic || '';
    retUserInfo.profit_y = self.__.parseInt(getYesterdayProfit(user));

    retUserInfo.upic = app.model.tools.fixUpicUrl(retUserInfo.upic, __.parseInt(user.appid)) || '';

    retUserInfo.usex = self.__.parseInt(user.usex);

    retUserInfo.viplevel = user.viplevel;
    cb(null, retUserInfo);
    return retUserInfo;
};

//处理好友列表中用户信息
exports.friendUserInfo = function (userInfo, cb) {
    var self = global.doweb;
    cb = cb || function () {
    };
    var user = userInfo;
    var retUserInfo = {};
    retUserInfo.uid = self.__.parseInt(user.uid);
    retUserInfo.uchips = self.__.parseInt(user.chips);
    retUserInfo.uname = L.uname(user.uname);
    retUserInfo.upic = user.upic || '';
    retUserInfo.usex = self.__.parseInt(user.usex);
    retUserInfo.offline_time = self.__.parseInt(user.offline_time);

    retUserInfo.viplevel = user.viplevel;
    if (retUserInfo.upic) {
        retUserInfo.upic = app.model.tools.fixUpicUrl(retUserInfo.upic, __.parseInt(user.appid));
    } else {
        retUserInfo.upic = '';
    }
    if (userInfo.roomId) {
        retUserInfo.roomid = userInfo.roomId;
    }

    cb(null, retUserInfo);
    return retUserInfo;
}

/**
 * 得到100手盈利率
 * @param {object} profitInfo
 * */
function getProfitH(profitInfo, cb) {
    if (profitInfo && profitInfo['count'] && profitInfo['count'] > 0) {
        cb(true, Number((profitInfo['profit'] / profitInfo['count' ]).toFixed(2)));
    } else {
        cb(false, 0);
    }
}

exports.getProfitH = getProfitH;

/**
 * 昨日盈利
 * @param profitInfo
 * @returns {*}
 */
function getYesterdayProfit(profitInfo) {
    var midNight = app.lib.foxjs.midNight();
    var oddCheck = getTodayOddCheck() ? 0 : 1;//取昨日的奇偶
    if (profitInfo['update_time_' + oddCheck] && profitInfo['update_time_' + oddCheck] >= midNight - 24 * 60 * 60) {
        return profitInfo['win_chips_' + oddCheck];
    } else {
        return 0;
    }
}

exports.getYesterdayProfit = getYesterdayProfit;
