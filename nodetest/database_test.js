"use strict";

let mysql_client = require('./lib/mysql').createClient({
    connectionLimit: 10,
    host: '192.168.3.105',
    user: 'root',
    password: 'master'
});

let redis_client = require('./lib/redis').createClient({
    host: '192.168.3.105',
    port: 6379
})

let memc_client = require('./lib/memcached').createClient({
    host: '192.168.3.105',
    port: 11211  
})

let testMysql = async () => {
    let sql = 'select * from gamehall_main.game_server where gameid = 7';
    let val = [];
    let result = await mysql_client.query(sql, val);
    console.log("mysql test 1 ");
    console.log(result);
    sql = 'select * from gamehall_main.game_serve where gameid = 7';
    result = await mysql_client.query(sql, val);
    console.log('mysql test 2 ');
    console.log(result);
    console.log('mysql test finished!');
};

let testRedis = async () => {
    let result = await redis_client.get('haha');
    console.log(result);
    result = await redis_client.set('haha', '12345678');
    console.log(result);
    result = await redis_client.get('haha');
    console.log(result);
    console.log('redis test finished!');  
};

let testMemcached = async () => {
    let result = await memc_client.get('haha');
    console.log(result);
    result = await memc_client.set('haha', '12345678');
    console.log(result);
    result = await memc_client.get('haha');
    console.log(result);
    console.log('memcached test finished!');
};

let test = async () => {
    await testMysql();
    await testRedis();
    await testMemcached();
};

test();