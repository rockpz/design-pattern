"use strict";

async function main() {
    const mysql = require('mysql2/promise');
    console.log(`1 || ${Date.now()}`);
    let num = await 1;
    console.log(`2 || ${Date.now()}   ${num}`);
    //return num;
    const connection = await mysql.createConnection({host: '192.168.3.105', user: 'root', password: 'master'});
    //const [rows, fields] = await connection.execute('select * from gamehall_main.game_server where gameid = 7', []);
    const data = await connection.query('select * from gamehall_main.game_server where gameid = 7', []);
    //console.log(rows);
    console.log(`3 || ${Date.now()}`);
    connection.end();
    return data;
};

async function subTest() {
    return 3;
};

async function test() {
    var a = main();
    console.log(`${Date.now()}  ${a} completed!`);
    console.log(a[0]);
    console.log(222);
    console.log(a[1]);
    var b = await subTest();
    console.log(b);
}

//test();
//https://www.youtube.com/watch?v=PNa9OMajw9w
//https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
exports.to = (promise) => {
    return promise.then(data => {
        return [null, data];
    })
    .catch(err => [err, null]);
}

async function mysql_test() {
    let pool = require("./mysql.js").mysql({
        "host"          : "192.168.3.105",
        "port"          : 3306,
        "user"          : "root",
        "password"      : "master",
        "database"      : "gamehall_main",
        "connectionLimit": 20
    });
    let result = await pool.query('select * from gamehall_main.game_server where gameid = 7', []);
    console.log(result);
    pool.end();
};

mysql_test();



//const mysql      = require('mysql2/promise');
//const bluebird   = require('bluebird');
//const connection = mysql.createConnection({
//    host: '192.168.3.120',
//    user: 'root',
//    password: 'master',
//    database: 'gamehall_main',
//    Promise:  bluebird
//})
//connection.then(function(res){
//    console.log(typeof(res.execute));
//    const result = res.execute('select * from gamehall_main.game_server where gameid = 7', []);
//    console.log(typeof(result));
//    console.log(typeof(result.then));
//    return result;
//}).then(function(res){
//    console.log(res[0]);
//    connection.end();
//}).catch(function(err){
//    console.error(err);
//});

//console.log(typeof(connection.then))
//console.log(typeof(connection.execute))
//.then(function(res){
//    return res.connection.execute('select * from gamehall_main.game_server where gameid = 7', []);
//}).then(function(res){
//    console.log(res[0]);
//}).catch(function(err){
//    console.error(err.stack);
//});

//console.dir(connection);
//console.log(`11111111  now: ${Date.now()}`);
//const [rows, fields] = connection.execute('select * from gamehall_main.game_server where gameid = 7', []);
//console.log(`22222222  now: ${Date.now()}`);
//console.log(rows);
//console.log(fields);