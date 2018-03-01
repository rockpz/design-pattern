/**
 * Created with JetBrains WebStorm.
 * User: zen
 * Date: 13-5-10
 * Time: 下午1:44
 * To change this template use File | Settings | File Templates.
 */
"use strict";


exports.createClient = function (opt) {
    let poolSize = opt.poolSize || 10;
    let memcached = require('memcached');
    memcached.config.poolSize = poolSize;
    let client = new memcached(opt.host + ":" + opt.port, {
        reconnect: 100, 
        retries: 2, 
        failures: 2, 
        timeout: 300, 
        failuresTimeout: 1000, 
        minTimeout: 100
    });

    let get = client.get;
    let set = client.set;
    let del = client.del;

    client.get = (key) => {
        return new Promise((resolve, reject) => {
            get.call(client, key, (err, data) => {
                if(err) return resolve([err, data]);
                if('string' != typeof data) {
                    try {
                        data = JSON.stringify(data);
                    } catch (ex) {
                        data = null;
                    }
                }
                resolve([err, data]);
            });
        });
    };

    client.getJSON = (key) => {
        return new Promise((resolve, reject) => {
            get.call(client, key, (err, data) => {
                if(err) return resolve([err, data]);
                if('string' == typeof data) {
                    try {
                        data = JSON.parse(data);
                    } catch (ex) {
                        data = null;
                    }
                }
                resolve([err, data]);
            });
        });  
    };

    client.set = (key, data, lefttime) => {
        if(null == lefttime) lefttime = 259200;
        if ('string' != typeof data) {
            try {
                data = JSON.stringify(data)
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
        return new Promise((resolve, reject) => {
            set.call(client, key, data, lefttime, (err, data) => {
                resolve([err, data]);
            });
        });
    };

    client.del = (key) => {
        return new Promise((resolve, reject) => {
            del.call(client, key, (err, data) => {
                resolve([err, data]);
            });
        });
    };

    client.delete = client.del;

    return client;
};