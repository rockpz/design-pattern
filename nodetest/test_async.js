"use strict";

var co = require("co");

var memcached = require("memcached");

var memClient = new memcached("192.168.3.120:11211", {
    reconnect: 100, 
    retries: 2, 
    failures: 2, 
    timeout: 300, 
    failuresTimeout: 1000, 
    minTimeout: 100
});

var promiseMysql = require("/usr/local/lib/node_modules/promise-mysql");
var mysqlPool = promiseMysql.createPool({
    host: "192.168.3.120",
    port: 3306,
    user: "root",
    password: "master",
    database: "gamehall_main"
});

var  async_fun = async function(){
    //try{
    //    let conn = await mysqlPool.getConnection();
    //    let results = await conn.query("select * from game_server");
    //    console.log(results);
    //    return 
    //} catch(err) {
    //    console.log(err);
    //    return
    //}

    let conn = await mysqlPool.getConnection();
    let results = await conn.query("select * from game_server");
    console.log(results);
    setTimeout(function(){
        console.log("process exit!")
        process.exit();
    }, 3000);
};

async_fun(); 
//co(async_fun);
console.log("test finished!");