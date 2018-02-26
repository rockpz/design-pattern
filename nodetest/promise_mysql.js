"use strict";

async function main() {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({host: '192.168.3.120', user: 'root', password: 'master'});
    const [rows, fields] = await connection.execute('select * from gamehall_main.game_server where gameid = 7', []);
    console.log(rows);
    console.log(fields);
    connection.end();
};

main();
console.log("completed!")

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