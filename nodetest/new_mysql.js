"use strict";

const mysql = require('mysql');

module.exports = function(opt) {
    let pool = mysql.createPool(opt);

    pool.execQuery = sqlOptions => {
        var results = new Promise((resolve, reject) => {

        });

        var results = new Promise((resolve, reject) => {
            connectionPool.getConnection((error,connection) => {
            if(error) {
                console.log("Get connection from mysql pool failed !");
                throw error;
            }

            var sql = sqlOptions['sql'];
            var args = sqlOptions['args'];

            if(!args) {
                var query = connection.query(sql, (error, results) => {
                    if(error) {
                        console.log('Execute query error !');
                        throw error;
                    }

                    resolve(results);
                });
            } else {
                var query = connection.query(sql, args, function(error, results) {
                    if(error) {
                        console.log('Execute query error !');
                        throw error;
                    }

                    resolve(results);
                });
            }

            connection.release(function(error) {
                if(error) {
                    console.log('Mysql connection close failed !');
                    throw error;
                }
            });
        });
    }).then(function (chunk) {
        return chunk;
    });

        return results;
    }
}