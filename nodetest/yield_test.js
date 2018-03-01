"use strict";

/*
* 迭代器 Iterator   生成器  Generator
* 任何对象有next方法和__iter__方法返回自己本身，则是迭代器对象
* 每个生成器都是迭代器，但是反过来不行。
* 通常生成器是通过调用一个或多个yield表达式构成的函数s生成的。
*/

function *foo() {
    console.log("yield 1 ");
    yield console.log("yield 11 ");
    yield 2;
    console.log("yield 3 ");
    yield 3;
    return;
}


// 生成器函数   foo
// var iter = foo()  生成器函数生成一个迭代器

var gen = foo();
console.dir(Object.keys(gen));
console.log(typeof(gen));
console.log(gen.next());
//console.log(gen.next());
//console.log(gen.next());
//console.log(gen.next());
//console.log(gen.next());


//console.log(foo().next());
//console.log(foo().next());
//console.log(foo().next());
//console.log(foo().next());
//console.log(foo().next());

//Promise 返回一个拥有then方法的对象或函数
//exports 
//Promise().then().catch(); 


asyncFun = async () => {
    console.log
    let a = await 10;

};


















//function a(d, cb) {
//    setTimeout(function(d){
//        console.log(d);
//        cb();
//    } ,d, 10000);
//}; 