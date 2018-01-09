"use strict";

var mysql = require('mysql');

module.exports = function (opt, moduleInitCallback) {
    moduleInitCallback = moduleInitCallback || function () { };

    var pool = mysql.createPool(opt);
    pool.oldQuery = pool.query;

    pool.query = function (sql, args, callback) {
        if (typeof args != 'function' && typeof callback != 'function') {
            var index = Math.min(arguments.length, 2);
            if (index == 1) {
                args = function () { };
            } else {
                callback = function () { };
            }
        }
        pool.oldQuery.call(pool, sql, args, function(err, ...rest) {
            if (err) {
                console.error('DBError:', sql, args, err);
            }
            callback(err, ...rest);
        });
    }

    pool.getOne = function (sql, args, callback) {
        if (arguments.length < 2) throw new Error("至少要两个参数.");

        if (typeof args === "function"){
            callback = args;
            args = null;
        }
        if (typeof callback !== "function") throw new Error("必需有回调函数");

        pool.query(sql, args, function (err, data) {
            if (err) {
                console.error('DBError:', sql, `[${args.join(',')}]`, err);
            }
            if (Array.isArray(data) && data.length > 0) {
                return callback(err, data[0]);
            }
            callback(err, null);
        });
    };

    pool.fieldEscape = function (field) {
        field = field.replace(/\s|'/g, '');
        field = pool.escape(field).replace(/\s|'/g, '');
        field = "`" + field + "`";
        return field;
    };
    pool.tableNameEscape = function (tableName) {
        tableName = tableName.replace(/^`+|`+$/g, '');
        tableName = "`" + tableName + "`";
        return tableName;
    };

    pool.setJSON = function (tableName, jsonData, jsonOpt, cb) {
        var sqlSet = [];
        var sqlData = [];
        for (var key in jsonData) {
            var row = jsonData[key];
            key = pool.fieldEscape(key);
            if (Array.isArray(row)) {
                sqlSet.push(key + '' + row[0] + '?');
                sqlData.push(row[1]);
            } else {
                sqlSet.push(key + '=?');
                sqlData.push(row);
            }

        }

        var pkSet = [];
        var pkData = [];
        for (var key in jsonOpt) {
            var row = jsonOpt[key];
            key = pool.fieldEscape(key);
            if (Array.isArray(row)) {
                var joinStr = row[2] || '';
                pkSet.push(key + '' + row[0] + '? ' + joinStr);
                pkData.push(row[1]);
            } else {
                pkSet.push(key + '=?');
                pkData.push(row);
            }
        }
        tableName = pool.tableNameEscape(tableName);
        var sql = "UPDATE " + tableName + " SET " + sqlSet.join(',') + " WHERE " + pkSet.join(' ');
        return pool.query(sql, [].concat(sqlData, pkData), cb);
    };

    pool.addSetJSON = function (tableName, data1, data2, cb) {
        if ('function' == typeof data2) {
            cb = data2;
            data2 = null;
        }

        var sqlSetIn = [];
        var sqlDataIn = [];

        for (var key in data1) {
            var row = data1[key];
            key = pool.fieldEscape(key);
            sqlSetIn.push(key + '=?');
            sqlDataIn.push(row);
        }

        var sqlSetUp = [];
        var sqlDataUp = [];
        if (data2) {
            for (var key in data2) {
                var row = data2[key];
                key = pool.fieldEscape(key);
                if (Array.isArray(row)) {
                    sqlSetUp.push(key + row[0] + '?');
                    sqlDataUp.push(row[1]);
                } else {
                    sqlSetUp.push(key + '=?');
                    sqlDataUp.push(row);
                }
            }

        } else {//如果没有指定修改所使用的数据，就使用插入的数据
            sqlSetUp = sqlSetIn;
            sqlDataUp = sqlDataIn;
        }

        tableName = pool.tableNameEscape(tableName);
        var sql = "INSERT INTO " + tableName + " SET " + sqlSetIn.join(',') + " ON DUPLICATE KEY UPDATE " + sqlSetUp.join(',');
        pool.query(sql, [].concat(sqlDataIn, sqlDataUp), cb);
    };

    pool.getConnection(function (err, conn) {
        moduleInitCallback(err);
        if (!err) {
            conn.on('error', function (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    module.exports(opt); // 断线自动重连
                    return;
                }
                var msg = app.util.format('mysql error: \r\n %j ', err);
                app.lib.log.error_report(msg);
            });
        }
    });
    return pool;
};
