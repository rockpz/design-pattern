"use strict";

var redis = require("redis");

var client = null;

var o2string = function (obj) {
    if ('string' != typeof obj) {
        try {
            obj = JSON.stringify(obj);
        } catch (ex) {
            try {
                obj = obj.toString();
            } catch (ex2) {
                obj = obj + '';
            }

        }
    }
    return obj;
};

exports.createClient = function (opt) {
    opt = opt || {};
    var port = opt.port || 6379;
    var host = opt.host || '127.0.0.1';

    var client = redis.createClient(port, host, opt);

    var oldSet = client.set;

    client.getJSON = function (key, cb) {
        cb = cb || function () {};
        return client.get.call(client, key, function (err, data) {
            if ('string' == typeof data) {
                try {
                    data = JSON.parse(data);
                } catch (ex) {
                    //如果转换错误，说明不是一个JSON格式的字符串
                    data = null;
                }
            }
            cb(err, data);
        });
    };

    client.set = function (key, data, cb, lefttime) {
        if (lefttime === null || typeof lefttime == "undefined") lefttime = 259200; //默认修改为3天
        cb = cb || function () {};
        data = o2string(data);
        return oldSet.call(client, key, data, function (err, data) {
            if (lefttime === 0) return cb(err, data);
            if (lefttime > 100000000) {
                client.expireat(key, lefttime);
                return cb(err, data);
            }
            client.expire(key, lefttime);
            return cb(err, data);
        });
    };

    client.hSet = function (key, hashKey, data, cb, lefttime) {
        if (lefttime === null || typeof lefttime == "undefined") lefttime = 259200; //默认修改为3天
        cb = cb || function () {};
        data = o2string(data);
        return client.hset.call(client, key, hashKey, data, function (err, data) {
            if (lefttime === 0) return cb(err, data);
            if (lefttime > 100000000) {
                client.expireat(key, lefttime);
                return cb(err, data);
            }
            client.expire(key, lefttime);
            return cb(err, data);
        });
    };

    /**
     * @params key, value, [value2, value3, value4 ..., ] callback, lefttime
     * @return {[type]} [description]
     */
    client.lPush = function () {
        if (arguments.length < 2) return false;
        var key = arguments[0];
        var cb = function () {};
        var lefttime = 0;
        var args = [key];
        var endFlag = false;
        var i = 1,
            n = arguments.length;
        for (; i < n; i++) {
            if (typeof arguments[i] == 'function') {
                cb = arguments[i];
                endFlag = true;
            } else {
                arguments[i] = o2string(arguments[i]);
            }
            if (endFlag) break;
            args.push(arguments[i]);
        }
        i++;
        if (endFlag && i < n && typeof arguments[i] == 'number') {
            lefttime = arguments[i];
        }
        var callback = function (err, data) {
            if (lefttime === 0) return cb(err, data);
            if (lefttime > 100000000) {
                client.expireat(key, lefttime);
                return cb(err, data);
            }
            client.expire(key, lefttime);
            return cb(err, data);
        };
        args.push(callback);

        return client.lpush.apply(client, args);
    };

    client.rPush = function () {
        if (arguments.length < 2) return false;
        var key = arguments[0];
        var cb = function () {};
        var lefttime = 0;
        var args = [key];
        var endFlag = false;
        var i = 1,
            n = arguments.length;
        for (; i < n; i++) {
            if (typeof arguments[i] == 'function') {
                cb = arguments[i];
                endFlag = true;
            } else {
                arguments[i] = o2string(arguments[i]);
            }
            if (endFlag) break;
            args.push(arguments[i]);
        }
        i++;
        if (endFlag && i < n && typeof arguments[i] == 'number') {
            lefttime = arguments[i];
        }
        var callback = function (err, data) {
            if (lefttime === 0) return cb(err, data);
            if (lefttime > 100000000) {
                client.expireat(key, lefttime);
                return cb(err, data);
            }
            client.expire(key, lefttime);
            return cb(err, data);
        };
        args.push(callback);

        return client.rpush.apply(client, args);
    };

    client.lSet = function (key, index, value, cb) {
        cb = cb || function () {};
        value = o2string(value);
        client.lset.call(client, key, index, value, cb);
    };

    client.zAdd = function (key, score, value, cb, lefttime) {
        if (lefttime === null || typeof lefttime == "undefined") lefttime = 259200; //默认修改为3天
        cb = cb || function () {};
        value = o2string(value);
        return client.zadd.call(client, key, score, value, function (err, data) {
            if (lefttime === 0) return cb(err, data);
            if (lefttime > 100000000) {
                client.expireat(key, lefttime);
                return cb(err, data);
            }
            client.expire(key, lefttime);
            return cb(err, data);
        });
    };

    client.hIncrBy = function (key, hashKey, value, cb, lefttime) {
        if (lefttime === null || typeof lefttime == "undefined") lefttime = 259200; //默认修改为3天
        cb = cb || function () {};
        value = parseInt(value) || 0;
        return client.hincrby.call(client, key, hashKey, value, function (err, data) {
            if (lefttime === 0) return cb(err, data);
            if (lefttime > 100000000) {
                client.expireat(key, lefttime);
                return cb(err, data);
            }
            client.expire(key, lefttime);
            return cb(err, data);
        });
    };

    return client;
};
