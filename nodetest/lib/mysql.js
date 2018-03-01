"use strict";

/*
pool.query(sql, args, callback)
*/

var mysql = require('mysql');

exports.createClient = function(opt) {
    let pool = mysql.createPool(opt);
    pool.oldQuery = pool.query;
    pool.query = function(sql, args) {
        return new Promise(function(resolve, reject){
            pool.oldQuery(sql, args, (err, data) => {
                resolve([err, data]);
            });
        });
    };

    return pool;
};