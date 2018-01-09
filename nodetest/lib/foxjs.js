/**
 * Copyright (c) 2012 Zen Wong
 * @author Zen Wong <wong@z-en.com>
 */

(function (_fox) {
    var objProto = Object.prototype;

    //函数列表，当前执行到的函数ID
    var __exec = function (funcs, count, fnSum, argv, self) {
        if (count == fnSum) {
            return;
        } else {
            funcs[count].call(
                self,
                function () {
                    count++;
                    __exec(funcs, count, fnSum, argv, self);
                },
                argv
            );
        }
    };

    var __,
        foxjs,
        fox;

    __ = foxjs = function () {
        return __._main.apply(__, arguments);
    };

    fox = __.fox = __.prototype = {};

    //判断是不是NODEJS
    if (typeof process !== 'undefined' && process.version) {
        __.isNode = fox.isNode = true;
    } else {
        __.isNode = fox.isNode = false;
    }

    fox.undefined = __.undefined = (__.getUndefined = function () {})();

    __._main = function (arg1, arg2, arg3) {
        var arg = arguments;
        var argLen = arg.length;
        var argType = [];
        var argIsArray = [];
        for (var i = 0; i < argLen; i++) {
            argType[i] = typeof arg[i];
            argIsArray[i] = Array.isArray(arg[i]);
        }
        if (argLen == 1) {

        } else if (argLen == 2) {
            if (argIsArray[0] && 'function' != argType[1]) {//同步函数 第一个数组 第二个不是函数
                return __.syncExec.apply(__, arg);
            } else if (('object' == argType[0] || argIsArray[0]) && 'function' == argType[1]) {//遍历函数 第一个是可便利的 第二个是函数
                return __.each(arg1, arg2);
            }
        } else {
            return __;
        }
    };

    //同步执行的函数
    __.syncExec = function (funcQ, argv) {
        var self = this;
        var fLen = funcQ.length;
        if (!Array.isArray(argv)) {
            argv = [argv];
        }
        return __exec(funcQ, 0, fLen, argv, self);
    };

    //总是返回数字的parseInt
    __.parseInt = function (val) {
        return parseInt(val) || 0;
    };

    //总是返回一个数字
    __.parseNumber = function (val) {
        return Number(val) || 0;
    };

    __.range = function (s, e) {
        var array = [];
        for (var i=0; i<=e-s; i++) {
            array.push(s+i);
        }
        return array;
    }

    //可以对数组和对象进行排序的函数
    __.sort = function (vals, context) {
        var val = vals;
        context = context || function (n1, n2) {
            return n1 > n2
        };
        var i = Object.keys(val).length, j;
        var isObject = false;
        if (!Array.isArray(val) && 'object' == typeof val) {
            isObject = true;
            val = Object.keys(vals);
        }
        var tempExchangVal;

        while (i > 0) {
            for (j = 0; j < i - 1; j++) {
                if (context(val[j], val[j + 1], vals)) {
                    tempExchangVal = val[j];
                    val[j] = val[j + 1];
                    val[j + 1] = tempExchangVal;
                }
            }
            i--;
        }
        return val;
    };

    //数组升序
    __.asc = function (arrOrObj) {
        var isArr = true;
        var arr = [];
        if (Array.isArray(arrOrObj)) {
            isArr = true;
            arr = arrOrObj;
        } else {
            isArr = false;
            arr = Object.keys(arrOrObj);
        }
        var keyS = arr.sort(function (min, max) {
            if (!isNaN(min) && !isNaN(max)) {
                return __.parseNumber(min) > __.parseNumber(max);
            } else {
                return min > max;
            }

        });
        if (isArr) {
            return keyS;
        } else {
            var retObj = {};
            for (var i in keyS) {
                retObj[keyS[i]] = arrOrObj[keyS[i]];
            }
            return retObj;
        }
    };

    //数组降序
    __.desc = function (arrOrObj) {
        var isArr = true;
        var arr = [];
        if (Array.isArray(arrOrObj)) {
            isArr = true;
            arr = arrOrObj;
        } else {
            isArr = false;
            arr = Object.keys(arrOrObj);
        }
        var keyS = arr.sort(function (min, max) {
            if (!isNaN(min) && !isNaN(max)) {
                return __.parseNumber(min) < __.parseNumber(max);
            } else {
                return min < max;
            }
        });
        if (isArr) {
            return keyS;
        } else {
            var retObj = {};
            for (var i in keyS) {
                retObj[keyS[i]] = arrOrObj[keyS[i]];
            }
            return retObj;
        }
    };

    //数组最近的一个大于VAL的数
    __.arrayCeil = function (arr, val, tropic) {
        var ret = __.undefined;
        if ('object' == typeof arr) {
            arr = Object.keys(arr);
        }
        if (!arr.length) {
            return ret;
        }

        val = __.parseNumber(val);

        if (isNaN(val))return val;
        arr = __.asc(__.numberItems(arr));
        var lastNumber = null;//最近一个结果
        for (var i in arr) {
            var _arrI = __.parseNumber(arr[i]);
            if (!isNaN(_arrI)) {
                lastNumber = _arrI;
                if (_arrI >= val) {
                    ret = _arrI;
                    break;
                }
            }
        }

        if (tropic && ret === __.getUndefined()) {//如果总是需要一个结果 并且没有找到结果
            ret = lastNumber;
        }
        return ret;
    };

    //数组中最近的小于VAL的数
    __.arrayFloor = function (arr, val, tropic) {
        var ret = null;
        if (!arr.length) {
            return ret;
        }
        val = __.parseNumber(val);
        if (isNaN(val))return val;
        arr = __.desc(__.numberItems(arr));
        var lastNumber = null;//最近一个结果
        for (var i in arr) {
            var _arrI = __.parseNumber(arr[i]);
            if (!isNaN(_arrI)) {
                lastNumber = _arrI;
                if (_arrI <= val) {
                    ret = _arrI;
                    break;
                }
            }
        }
        if (tropic && ret === null) {//如果总是需要一个结果 并且没有找到结果
            ret = lastNumber;
        }
        return ret;
    };

    //获得数组中最小的数字
    __.arrayMin = function (arr) {
        return Math.min.apply(this, arr);
    };

    //获得数组中最大的数字
    __.arrayMax = function (arr) {
        return Math.max.apply(this, arr);
    };

    //数组求和
    __.arraySum = function (arrA) {
        if (Array.isArray(arrA)) {
            var arr = arrA;
        } else {
            var arr = [];
            for (var i = 0; i < arguments.length; i++) {
                arr[i] = arguments[i];
            }
        }
        var sum = 0;
        arr.map(function (n) {
            sum += __.parseNumber(n)
        });
        return sum;
    };

    //求数组平均值
    __.arrayAverage = function (arr) {
        var sum = __.arraySum(arr);
        return sum / arr.length;
    };

    //耙子，就是为OBJ数组纵向过滤
    __.rake = function (arg, cb) {
        var argType = typeof arg[0];
        var retData = null;
        if ('array' == argType) {
            retData = [];
        } else {
            retData = {};
        }
        for (var key in arg[0]) {
            var values = [];
            for (var i in arg) {//取得每一行的每一个KEY
                values.push(arg[i][key]);
            }
            cb(key, values);
        }
    };

    //构造一个对象
    __.object = function () {
        var obj = {};
        for (var i = 0; i < arguments.length; i = i + 2) {
            obj[arguments[i]] = arguments[i + 1];
        }
        return obj;
    };

    //获得数组或对象的所有数字项目,但不改变项目的类型
    __.numberItems = function (arrOrObj) {
        var isArr = true;
        if (Array.isArray(arrOrObj)) {
            isArr = true;
        } else {
            isArr = false;
        }

        if (!isArr) { //如果是对象
            var retObjVal = {};
            for (var key in arrOrObj) {
                if (!isNaN(Number(arrOrObj[key]))) {
                    retObjVal[key] = arrOrObj[key];
                }
            }
            return retObjVal;
        } else {
            var retArrVal = [];
            for (var i in arrOrObj) {
                if (!isNaN(Number(arrOrObj[i]))) {
                    retArrVal.push(arrOrObj[i]);
                }
            }
            return retArrVal;
        }
    };

    //获得数组或对象的项目转换为数字的表现
    __.items2Number = function (arrOrObj) {
        var numVal = __.numberItems(arrOrObj);
        for (var key in numVal) {
            numVal[key] = __.parseNumber(numVal[key]);
        }
        return numVal;
    };

    __.arg2Arr = function (arg) {
        var arr = [];
        for (var i = 0; i < arg.length; i++) {
            arr[i] = arg[i];
        }
        return arr;
    }

    //数组去重
    __.arrayUniq = function (arr) {
        var retArr = {};
        for (var i in arr) {
            retArr[arr[i]] = true;
        }
        return Object.keys(retArr);
    };

    //随机从数组中取一个出来
    __.arrayRandPop = function (arr) {
        var len = arr.length;
        if (!len) return this.getUndefined();
        var r = parseInt(Math.random() * len);
        return arr.splice(r, 1);
    };

    //随机获得一个
    __.arrayRand = function (arr) {
        var len = arr.length;
        if (!len) return this.getUndefined();
        var r = parseInt(Math.random() * len);
        return arr[r];
    };

    //判断是否有一个或多个在数组中
    __.inArray = function (val, other) {
        var arr = [];
        if (Array.isArray(val)) {
            arr = val || [];
        } else {
            arr = __.keys(val || {});
        }
        for (var i = 1; i < arguments.length; i++) {
            if (~arr.indexOf(arguments[i])) {
                return true;
            }
        }
        return false;
    };

    //判断是否全部都在数组中
    __.inArrayAll = function (val, other) {
        var arr = [];
        if (Array.isArray(val)) {
            arr = val;
        } else {
            arr = __.keys(val);
        }
        for (var i = 1; i < arguments.length; i++) {
            if (!~arr.indexOf(arguments[i])) {
                return false;
            }
        }
        return true;
    };

    //倒序数组或对象
    __.reverse = function (val) {
        if (Array.isArray(val)) {
            return val.reverse();
        } else {
            var retVal = {};
            var valKey = __.reverse(__.keys(val));
            for (var i in valKey) {
                retVal[valKey[i]] = val[valKey[i]];
            }
            val = retVal;
            return val;
        }
    };

    //获得数组或对象的下一个项目
    __.next = function (arrOrObj, now, _return) {
        var arr = [];
        var isArr = true;
        if (!Array.isArray(arrOrObj)) {
            arr = Object.keys(arrOrObj || {});
            isArr = false;
        } else {
            arr = arrOrObj;
            isArr = true;
        }
        _return = _return || false;
        var retVal = __.getUndefined();
        var i = arr.indexOf(now);
        i = i == -1 ? arr.indexOf(now + '') : i;//如果按数字没有找到就按字符串找
        if (~i) {//如果找到了
            if (i == arr.length - 1) {
                if (_return) {//允许返回找
                    retVal = arr[0];
                }
            } else {
                retVal = arr[i + 1];
            }
        }
        return retVal;
    };

    //在一个数组或对象对环形找下一个
    __.loop = function (arr, now) {
        now = __.parseNumber(now);
        if (isNaN(now)) {
            return false;
        }

        if (!Array.isArray(arr)) {
            if ('object' == typeof arr) {
                arr = Object.keys(arr);
            } else {
                return false;
            }
        }

        arr = __.asc(arr);//升序排列

        for (var i in arr) {
            var arrI = __.parseNumber(arr[i]);
            if (!isNaN(arrI) && arrI > now) {
                return arrI;
            }
        }
        return arr[0];
    };

    //获得对象的全部值
    __.values = function (obj) {
        if (Array.isArray(obj))return obj;

        var vals = [];
        var keys = __.keys(obj);
        for (var i in keys) {
            var key = keys[i];
            vals.push(obj[key]);
        }
        return vals;
    };

    __.keys = function (obj) {

        if (!obj)return [];

        return Object.keys(obj);
    };

    //获得OBJ的值和KEY交换后的对象，相同的KEY被最后的一个取代
    __.values2Keys = function (obj) {
        var ret = {};
        for (var key in obj) {
            ret[obj[key]] = key;
        }
        return ret;
    };

    //获得子数组
    __.sub = function (arr, start, end) {
        if (start < 0) {
            start = __.len(arr) + start;
        }
        if (end === true) {
            end = __.len(arr);
        } else if (end < 0) {
            end = __.len(arr) + end;

        } else {
            end = start;
        }

        if (Array.isArray(arr)) {
            return arr.slice(start, end + 1);
        } else if ('string' == typeof arr) {
            return arr.substring(start, end + 1);
        } else {

            var keys = __.keys(arr);
            keys = keys.slice(start, end + 1);

            var retVal = {};
            for (var i in keys) {
                var key = keys[i];
                retVal[key] = arr[key];

            }
            return retVal;
        }
    };

    //将两个或多个对象合并，返回值永远是对象
    __.objectConcat = __.merge = function () {
        var obj = {};
        for (var i = 0; i < arguments.length; i++) {
            var keys = __.keys(Object(arguments[i]));
            for (var ii in keys) {
                var key = keys[ii];
                obj[key] = arguments[i][key];
            }
        }
        return obj;
    };

    //按对象值降序排列
    __.descValues = function (obj) {
        var ret = {};
        var values = __.desc(__.values(obj));
        for (var i in values) {
            for (var key in obj) {
                if (obj[key] == values[i]) {
                    ret[key] = obj[key];
                }
            }
        }
        return ret;
    };

    //按对象值升序排列
    __.ascValues = function (obj) {
        var ret = {};
        var values = __.asc(__.values(obj));
        for (var i in values) {
            for (var key in obj) {
                if (obj[key] == values[i]) {
                    ret[key] = obj[key];
                }
            }
        }
        return ret;
    };

    __.trim = function (val, hask) {
        if ('string' == typeof val) {
            hask = hask || ' ';
            var lIndex = 0;
            var rIndex = -1;
            for (var i = 0; i < val.length; i++) {
                if (val[i] != hask) {
                    lIndex = i;
                    break;
                }
            }
            for (var i = (val.length - 1); i >= 0; i--) {
                if (val[i] != hask) {
                    rIndex = i;
                    break
                }
            }
            return val.substring(lIndex, rIndex + 1);
        } else if (Array.isArray(val)) {
            for (var i in val) {
                if (val[i] == hask) {
                    val.shift();
                } else {
                    break;
                }
            }
            for (var i = (val.length - 1); i >= 0; i--) {
                if (val[i] == hask) {
                    val.pop();
                } else {
                    break;
                }
            }
            return val;
        } else {
            return val;
        }
    };

    // cryptographically secure pseudo-random numbers
    __.randomIntSafe = function(min, max) {
        var crypto = require('crypto');
        var format = require('biguint-format');
        var x = format(crypto.randomBytes(4), 'dec');
        return Math.floor(x/Math.pow(2, 32) * (max - min + 1)) + min;
    };

    //洗牌
    __.shuffle = function (arr) {
        if (!Array.isArray(arr)) {
            arr = Object.keys(arr);
        }
        var len = arr.length;
        for (var i in arr) {
            var rand = __.randomIntSafe(0, len-1);//随机找一个人和当前的人换位置
            var tmp = arr[rand];
            arr[rand] = arr[i];
            arr[i] = tmp;
        }
        return arr;
    };

    //萃取
    __.each = function (val, func, other) {
        var arg = __.arg2Arr(arguments);
        var arg = arg.slice(2);
        var retVal = null;
        if (Array.isArray(val)) {
            retVal = [];
        } else {
            retVal = {};
        }
        for (var key in val) {
            var ret = func.apply(this, [].concat(val[key], key, val, arg));
            if (ret !== __.getUndefined()) {
                retVal[key] = ret;
            }
        }
        return retVal;
    };

    var _typeObj = {};
    __.each("Boolean,Number,String,Function,Array,Date,RegExp,Object,Error".split(","), function (typeName) {
        _typeObj[typeName] = "[object " + typeName + "]";
        __['is' + typeName] = function (val) {
            return objProto.toString.call(val) === _typeObj[typeName];
        }
    });

    //寻找
    __.find = function (val, func, other) {
        var arg = __.arg2Arr(arguments);
        var arg = arg.slice(2);
        for (var key in val) {
            var ret = func.apply(this, [].concat(val[key], key, val, arg));
            if (ret) {
                return val[key];
            }
        }
    };

    //指定循环次数
    __.times = function (num, func) {
        var retVal = [];
        for (var i = 0; i < num; i++) {
            retVal[i] = func(i);
        }
        return retVal;
    };

    //获得数组或对象的长度
    __.len = function (val) {
        if (!val)return 0;
        if ('string' == typeof val) {
            return val.length;
        } else {
            return Object.keys(val).length;
        }
    };

    //获得多少天前或后的时间戳
    __.time = function (optArray, timeMSec) {
        optArray = optArray || [];
        var now = timeMSec || Date.now();
        if (optArray.length) {
            now += __.parseInt(optArray[4]);//毫秒
            now += __.parseInt(optArray[3]) * 1000;//秒
            now += __.parseInt(optArray[2]) * 60000;//分钟
            now += __.parseInt(optArray[1]) * 3600000;//小时
            now += __.parseInt(optArray[0]) * 86400000;//天
        }
        return now;
    };

    __.isVIP = function (level, lifetime) {
        if (level <= 0) {
            return 0;
        }
        if (lifetime < 10) return level;// 下月生效的新等级
        if (lifetime > Math.floor(Date.now() / 1000) ){
            return level;
        }
         return 0;
    }

    //获得连续的数字
    __.isLink = function (numArr, sorted) {
        if (!sorted) {//如果没有排序
            numArr = __.asc(numArr);//升序排列
        }
        var numArrLen = numArr.length;
        if (Math.abs(numArr[0] - numArr[numArrLen - 1]) + 1 == numArrLen) {
            return true;
        } else {
            return false;
        }
    };

    //空函数
    __.funcNone = function () {
        if (arguments.length && 'function' == typeof arguments[arguments.length - 1]) {
            var arg = [];

            for (var i = 0; i < arguments.length; i++) {
                arg[i] = arguments[i];
            }
            var len = arg.length;

            arg[len - 1].apply(this, arg.slice(0, arg.length - 1));
        }
    };

    //随机数
    __.rand = function (min, max) {
        if (Array.isArray(min)) {
            return min[__.rand(0, min.length - 1)];
        } else if (arguments.length >= 2) {
            if (min > max) {
                var _tmp = max;
                max = min;
                min = _tmp;
            } else if (min == max) {
                return parseInt(min);
            }
            return parseInt(Math.random() * (max - min + 1) + min);
        } else {
            return __.getUndefined();
        }
    };

    //几率
    __.odds = function () {
        var args = arguments;
        var len = args.length;
        if (!len)return __.getUndefined();
        var oddsArr = [];//所有设定的概率

        for (var i = 0; i < len; i++) {
            if (Array.isArray(args[i]) && args[i].length == 2 && args.hasOwnProperty(i) && !isNaN(args[i][0])) {
                args[i][0] = __.parseNumber(args[i][0]);
                oddsArr.push(args[i]);
            }
        }

        oddsArr = oddsArr.sort(function (n1, n2) {
            return n2[0] < n1[0]
        });

        var nowOddsNumber = 0;
        for (var i in oddsArr) {

            oddsArr[i][0] += nowOddsNumber;
            nowOddsNumber = oddsArr[i][0];
        }

        var r = Math.random();
        for (var i in oddsArr) {
            if (r <= oddsArr[i][0]) {
                return oddsArr[i][1];
            }
        }
        return oddsArr[oddsArr.length - 1][1];
    };

    //傻瓜盒子，假概率
    var allGumpBoxs = __.allGumpBoxs = {};
    __.gumpBox = function (boxid) {//第一个参数是盒子名称
        var args = arguments;
        var argLen = args.length;
        if (argLen == 1) {//get one gump box
            return allGumpBoxs[boxid];
        } else if (argLen == 0) {// fulsh gump box
            allGumpBoxs = {};
            return allGumpBoxs;
        } else if (args[1] === null) {// fulsh one gump box
            delete allGumpBoxs[boxid];
            return null;
        } else if (__.isObject(args[1])) {// set a gump box
            allGumpBoxs[boxid] = args[1];
            return __.getUndefined();
        }

        var args = {};
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
        if (!allGumpBoxs[boxid] && Object.keys(args).length > 0) {//大于0就是设置
            allGumpBoxs[boxid] = args;
        }
        var giftKey = Object.keys(allGumpBoxs[boxid]);
        var giftLen = giftKey.length;
        var giftIndex = giftKey[__.rand(0, giftLen - 1)];
        var gift = allGumpBoxs[boxid][giftIndex];

        if (gift) {
            allGumpBoxs[boxid][giftIndex][0] = __.parseInt(allGumpBoxs[boxid][giftIndex][0]) - 1;
            if (allGumpBoxs[boxid][giftIndex][0] < 1) {
                delete allGumpBoxs[boxid][giftIndex];
            }
            if (Object.keys(allGumpBoxs[boxid]).length == 0) {
                delete allGumpBoxs[boxid];
            }
            return gift[1];
        }
    };

    //现在就做超时
    __.doTimeout = function () {
        var args = __.arg2Arr(arguments);
        args[1] = args[1] || 0;
        var arg = args.slice(2);
        var func = args[0];
        var hd = 0;
        args[0] = function () {
            func.apply(hd, arg);
        };
        hd = setTimeout.apply(null, args);
        args[0].call(hd);
        return hd;
    };
    //现在就做间隙
    __.doInterval = function () {
        var args = __.arg2Arr(arguments);
        args[1] = args[1] || 0;
        var arg = args.slice(2);
        var func = args[0];
        var hd = 0;
        args[0] = function () {
            func.apply(hd, arg);
        };
        hd = setInterval.apply(null, args);
        args[0].call(hd);
        return hd;
    };

    __.now = function () {
        return (Date.now() / 1000) | 0;
    };

    __.midNight = function (time) {
        if (time) {
            var now = new Date(time * 1000);
        } else {
            var now = new Date();
        }
        return Math.floor(now.getTime() / 1000) - (now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds());
    };

    __.dateFormat = function (formatStr, time, milli) {	//日期函数
        var d = null;
        if (!isNaN(time = parseInt(time))) {
            d = new Date(time * 1000);
        } else if (!isNaN(milli = parseInt(milli))) {//如果是毫秒
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
        formatStr = formatStr.replace('l', leftPad(d.getMilliseconds()));
        return formatStr;

    };

    function leftPad(str) {
        str = ''+str;
        if (str.length >= 3) return str;
        if (str.length == 1) return '00'+str;
        return '0'+str;
    }

    /**
     * 今天0点时间戳
     * @return {[type]} [description]
     */
    __.today = function () {
        var d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d.getTime() / 1000;
    };

    /**
     * 昨天0点时间戳
     * @return {[type]} [description]
     */
    __.yesterday = function () {
        var d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d.getTime() / 1000 - 3600 *24;
    };

    /**
     * 明天0点时间戳
     * @return {[type]} [description]
     */
    __.tomorrow = function () {
        var d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d.getTime() / 1000 + 3600 *24;
    };

    //解UNICODE
    __.escapeUnicode = function (str) {
        return escape(str).replace(/%/g, '\\');
    };

    //反解UNICODE
    __.unEscapeUnicode = function (unicode) {
        return unescape(unicode.replace(/\\u/gi, '%u'));
    };

    var uuid = 1;
    var uuidNameSpace = {};
    __.uuid = function (nameSpace) {

        if (nameSpace) {
            uuidNameSpace[nameSpace] = uuidNameSpace[nameSpace] || 1;
            return uuidNameSpace[nameSpace]++;
        } else {
            return uuid++;
        }

    };

    __.isUndefined = function (val) {
        return val === __.getUndefined();
    };

    __.isNumber = function (val) {
        return (isFinite(val) && __.typeof(val) == 'Number');
    };

    //获得变量类型
    __.type = function (val) {
        return objProto.toString.call(val);
    };

    __.typeof = function (val) {
        var type = __.type(val);
        return type.replace(/\[object\ (.*)\]/, '$1');
    };

    //常量
    __.CONST = {};
    __.define = function (key, val) {
        if (arguments.length <= 0) {
            __.CONST = {};
            return __;
        }
        key = key + '';
        __.CONST[key.toUpperCase()] = val;
        return __;
    };

    //数据仓库
    var _data = {};
    __.data = function (name, val) {
        var argLen = arguments.length;
        if (argLen == 0) {
            _data = {};
            return __;
        } else if (argLen == 1) {
            return _data[name];
        } else {
            _data[name] = val;
            return val;
        }
    };

    var __nodeJSInit = function () {
        __.nextTick = function (func, arg) {
            return process.nextTick(function () {
                func.call(__, arg);
            });
        };
    };

    var __noNodeJSInit = function () {
        __.nextTick = function (func, arg) {
            return setTimeout(func, 0, arg);
        };
    };

    if (__.isNode) {
        __nodeJSInit();
        module.exports = foxjs;
    } else {
        __noNodeJSInit();
        window.foxjs = window.__ = foxjs;
    }

})();
