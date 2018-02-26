"use strict";

//将回调函数用co库封装，
//如何封装标准库
//业务代码的表现形式是怎样的

var co = require('co');

co(function *(){
    var a = Promise.resolve(1);
    var b = Promise.resolve(2);
    console.log(a, b, Date.now());
    var res = yield [a,b];
    console.log(res, Date.now());
}).catch(onerror);


function onerror(err) {
    console.error(err.stack);
}