"use strict";

const pool = require("./promise_mysql_pool");

function execute(sql, param) {
    let connection = null;
    pool.getConnection().then(function(conn){
        connection = conn;
        return conn.query('select * from gamehall_main.game_server where gameid = 7', []);
    }).then(function(result){
        console.log(result);
        connection.release();
        return result;
    }).catch(function(err){
        console.error(err);
        if(connection) {
            connection.release();
        }
    })
};

let res = execute();
console.log(`res is ${res}`);

function getUserID(uid) {
    let sql = '';
    let param = uid;
    app.mysql.execute(sql, param).then().catch();
}