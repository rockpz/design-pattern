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
    let client = redis.createClient(opt.port, opt.host, opt);

    let set = client.set;

    let get = client.get;

    client.get = (key) => {
        return new Promise((resolve, reject) => {
            get.call(client, key, (err, data) => {
                resolve([err, data]);
            });
        });
    };

    client.getJSON = (key) => {
        return new Promise((resolve, reject) => {
            get.call(client, key, (err, data) => {
                if ('string' == typeof data) {
                    try {
                        data = JSON.parse(data);
                    } catch (ex) {
                        //如果转换错误，说明不是一个JSON格式的字符串
                        data = null;
                    }
                }
                resolve([err, data]);    
            });
        });
    };

    client.set = (key, data, lefttime) => {
        if (lefttime === null || typeof lefttime == "undefined") lefttime = 259200; //默认修改为3天
        data = o2string(data);
        return new Promise((resolve, reject) => {
            set.call(client, key, data, (err, data) => {
                if(lefttime > 100000000) {
                    client.expireat(key, lefttime);    
                } else if(0 !== lefttime) {
                    client.expireat(key, lefttime);    
                }
                resolve([err, data]);
            });
        });
    };

    client.hIncrBy = (key, hashKey, value, lefttime) => {
        if (lefttime === null || typeof lefttime == "undefined") lefttime = 259200; //默认修改为3天
        value = parseInt(value) || 0;
        return new Promise((resolve, reject) => {
            client.hincrby(key, hashKey, value, (err, data) => {
                if(lefttime > 100000000) {
                    client.expireat(key, lefttime);    
                } else if(0 !== lefttime) {
                    client.expireat(key, lefttime);    
                }
                resolve([err, data]); 
            });
        });
    };

    return client;
};
