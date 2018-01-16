"use strict";

/*
*  Node异步编程表现形式
*  thunk函数     http://www.ruanyifeng.com/blog/2015/05/thunk.html
*  Promise对象   http://www.ruanyifeng.com/blog/2015/05/co.html
*  async函数     http://www.ruanyifeng.com/blog/2015/05/async.html
*/


var fs = require("fs");
//thunk
var thunkify  = require("thunkify");
var treadFile = thunkify(fs.readFile);
var tgen = function* () {
    let r1 = yield treadFile("./a.log");
    console.log(r1.toString());
    let r2 = yield treadFile("./b.log");
    console.log(r2.toString());
};

// 朴素型
var tg = tgen();
//var tr1 = tg.next();
//tr1.value(function(err, data) {
//    if(err) throw err;
//    let tr2 = tg.next(data);
//    tr2.value(function(err, data){
//        if(err) throw err;
//        tg.next(data);
//    });
//});

// 递归
function trun(fn) {
    let gen = fn();
    function next(err, data) {
        var result = gen.next(data);
        if(result.done) return;
        result.value(next);
    };

    next();
};
//trun(tgen);


//promise
var preadFile = function(fileName) {
    return new Promise(function(resolve, reject){
        fs.readFile(fileName, function(err, data){
            if(err) reject(err);
            resolve(data);
        });
    });
};

var pgen = function* () {
    let f1 = yield preadFile("./a.log");
    console.log(f1.toString());
    let f2 = yield preadFile("./b.log");
    console.log(f2.toString());
};
//朴素型
//var pg = pgen();
//pg.next().value.then(function(data){
//    pg.next(data).value.then(function(data){
//        pg.next(data);
//    });
//});
//递归
function prun(gen) {
    let g = gen();

    function next(data) {
        let result = g.next(data);
        if(result.done) return result.value;
        result.value.then(function(data){
            next(data);
        });
    }

    next();
};
//prun(pgen);

//async
var areadFile = async function() {
    let f1 = await preadFile("./a.log");
    let f2 = await preadFile("./b.log");
    console.log(f1.toString());
    console.log(f2.toString());
}
areadFile();































