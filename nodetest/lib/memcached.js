/**
 * Created with JetBrains WebStorm.
 * User: zen
 * Date: 13-5-10
 * Time: 下午1:44
 * To change this template use File | Settings | File Templates.
 */
"use strict";

const CRCJSON = require('circular-json');

console.mc = console.mc || function() {};

exports.createClient = function (opt) {
    opt = opt || {};
    var poolSize = opt.poolSize || 30;
    var host = opt.host || '127.0.0.1';
    var port = opt.port || '11211';
    var memcached = require('memcached');
    memcached.config.poolSize = poolSize;
    var conn = new memcached(host + ":" + port,
        {reconnect: 100, retries: 2, failures: 2, timeout: 300, failuresTimeout: 1000, minTimeout: 100});

    var oldSet = conn.set;
    conn.set = function (key, data, cb, lefttime) {
        if (lefttime == null) lefttime = 259200; //默认修改为3天
        lefttime = lefttime | 0;
        cb = cb || function () {};
        if ('string' != typeof data) {
            try {
                data = CRCJSON.stringify(data)
            } catch (ex) {
                ex && console.error('mc.set', key, 'ex', ex.message);
                try {
                    data = data.toString()
                } catch (ex2) {
                    ex2 && console.error('mc.set', key, 'ex2', ex2.message);
                    data = data + '';
                }
            }
        }
        console.mc('set', key, data, lefttime);
        return oldSet.call(conn, key, data, lefttime, cb);
    };

    var oldGet = conn.get;
    conn.get = function (key, cb) {
        cb = cb || function () {
        };
        return oldGet.call(conn, key, function (err, data) {
            console.mc('get', key, err || data);
            if ('string' != typeof data) {
                data = CRCJSON.stringify(data);
            }
            cb(err, data);
        });
    };

    conn.getJSON = function (key, cb) {
        cb = cb || function () {};
        return conn.get.call(conn, key, function (err, data) {
            if ('string' == typeof data) {
                try {
                    data = CRCJSON.parse(data);
                } catch (ex) {
                    ex && console.error('mc.get', key, 'ex', ex.message);
                    //如果转换错误，说明不是一个JSON格式的字符串
                    data = null;
                }
            }
            cb(err, data);
        });
    };

    var oldIncr = conn.incr;
    conn.incr = function (key, v, cb, lifetime) {
        cb = cb || function(){};
        lifetime = lifetime || 0;
        oldIncr.call(conn, key, v, function (err , newvalue) {
            if (err) return cb(err);
            if (newvalue === false) return conn.add(key, v, lifetime, function (e, f) {
                if (f) return cb(e, v);
                cb(e, f);
            });
            cb(err, newvalue);
        });
    };

    var oldDecr = conn.decr;
    conn.decr = function (key, v, cb, lifetime) {
        cb = cb || function(){};
        lifetime = lifetime || 0;
        oldDecr.call(conn, key, v, function (err , newvalue) {
            if (err) return cb(err);
            if (newvalue === false) return conn.add(key, v, lifetime, function (e, f) {
                if (f) return cb(e, v);
                cb(e, f);
            });
            cb(err, newvalue);
        });
    };

    conn.setJSON = conn.set;

    conn.delete = conn.del;

    conn.getDuo = function (key, bder, cb, lefttime) {// bder构造器
        conn.get(key, function (err, data) {
            if (data == null || data == undefined) {//没有找到数据
                bder(function (dataIn) {
                    conn.set(key, dataIn, function (error) {
                        cb(err, dataIn);
                    }, lefttime);
                });
            } else {
                cb(err, data);
            }
        });
    };

    conn.getDuoJSON = function (key, bder, cb, lefttime) {// bder构造器
        conn.getJSON(key, function (err, data) {
            if (data == null || data == undefined) {//没有找到数据
                bder(function (dataIn) {
                    conn.setJSON(key, dataIn, function (error) {
                        cb(err, dataIn);
                    }, lefttime);
                });
            } else {
                cb(err, data);
            }
        });
    };

    conn.getDuoJSON = conn.getDuo;
    return conn;
};

exports.create = function (opt) {
    console.log('create mc:', opt);
    var conn = exports.createClient(opt);
    return function () {
        return conn;
    };
};
