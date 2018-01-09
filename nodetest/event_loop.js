"use strict";

// macrotasks: script(整体代码), setTimeout,  setInterval,  setImmediate, I/O, UI rendering  
// microtasks: process.nextTick, Promises, Object.observe, MutationObserver
/*
* Javascript引擎首先从macrotask queue中取出第一个任务，
* 执行完毕后，将microtask queue中的所有任务取出，按顺序全部执行，
* 然后再从macrotask queue中取下一个，
* 执行完毕后，再次将microtask queue中的全部取出，
* 循环往复，直到两个queue中的任务都取完。
*/

// process.nextTick > promise.then > setTimeout > setImmediate

/*
console.log(1);

setImmediate(function(){
    console.log(2);
},0);

setTimeout(function(){
    console.log(3);
},0);

new Promise(function(resolve){
    console.log(4);
    resolve();
    console.log(5);
}).then(function(){
    console.trace();
    console.log(6);
});

console.log(7);

process.nextTick(function(){
    console.log(8);
});

console.log(9);
*/

console.log("script start ", Date.now());

setTimeout(function(){
    console.log("setTimeout 1 ", Date.now());
}, 0);

setTimeout(function(){
    console.log("setTimeout 2 ", Date.now());
}, 0);

Promise.resolve().then(function(resolve) {
    console.log("promise1 ", Date.now());
    process.nextTick(function () {
        console.log("nextTick 延迟执行3 ", Date.now());
    });
    setTimeout(function(){
        console.log("setTimeout in microtask ", Date.now());
    }, 0);
}).then(function(){
    console.log("promise2 ", Date.now());
    process.nextTick(function () {
        console.log('nextTick 延迟执行4 ', Date.now());
    });
});

process.nextTick(function () {
    process.nextTick(function () {
        console.log("nextTick 延迟执行2 ", Date.now());
    });
    console.log("nextTick 延迟执行1 ", Date.now());
});

setImmediate(function () {
    console.log("setImmediate延迟执行1 ", Date.now());
    process.nextTick(function () {
        console.log("强势插入 ", Date.now());
    })
});

console.log("script end", Date.now());










