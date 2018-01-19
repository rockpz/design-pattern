"use strict";

/* co api
*  co.wrap(fn)
*  createPromise()
*  co(gen)
*  onFulfilled(res)
*  onRejected(err)
*  next(ret)
*  toPromise(obj)
*  thunkToPromise(fn)
*  arrayToPromise(obj)
*  objectToPromise(obj)
*  defer(promise, key)
*  isPromise(obj)
*  isGenerator(obj)
*  isGeneratorFunction(obj)
*  isObject(val)
*/

/*
* promise艰涩的语法 假定doSomething和doSomethingElse都返回Promise对象
doSomething().then(function(){
    return doSomethingElse(); 
}).then(finalHandler);
doSomething
|-----------------|
                  doSomethingElse(undefined)
                  |------------------|
                                     finalHandler(resultOfDoSomethingElse)
                                     |------------------|

doSomething().then(function(){
   doSomethingElse(); 
}).then(finalHandler);
doSomething
|-----------------|
                  doSomethingElse(undefined)
                  |------------------|
                  finalHandler(undefined)
                  |------------------|

doSomething().then(doSomethingElse()).then(finalHandler);
doSomething
|-----------------|
doSomethingElse(undefined)
|---------------------------------|
                  finalHandler(resultOfDoSomething)
                  |------------------|

doSomething().then(doSomethingElse).then(finalHandler);
doSomething
|-----------------|
                  doSomethingElse(resultOfDoSomething)
                  |------------------|
                                     finalHandler(resultOfDoSomethingElse)
                                     |------------------|

then方法内部可以做三件事：
1 return一个promise对象
2 return一个同步的值或者undefined
3 同步的throw一个错误
somePromise().then(function(d){return data}).then(function(data){});
第2个then中的data是第一个then中的返回值，它并不关心data是同步的方式得到还是异步的方式得到；
如果第一个then中的函数没有返回值，则第二个then中的data是undefined

比较好的方式不使用then方法的第二个参数，转而使用catch()方法，除非想确认一个异常被抛出


var doSomething = function () {
    return Promise.resolve('foo');
}

var doSomethingElse = function () {
    return Promise.resolve('bar')    
};

Promise.resolve('foo').then(Promise.resolve('bar')).then(function (result) {
  console.log(result);
});

Promise.resolve('foo').then(function() {return Promise.resolve('bar')}).then(function (result) {
  console.log(result);
});

Promise.resolve('foo').then(function() {Promise.resolve('bar')}).then(function (result) {
  console.log(result);
});

Promise.resolve('foo').then(Promise.resolve('bar')).then(function (result) {
  console.log(result);
});

Promise可以用来解决回调地狱问题，但是仍然不可避免的会有回调出现，更好的解决方案是利用Generator来减少回调
*/

function toPromise(obj) {
    if(!obj) return obj;
    if(isPromise(obj)) return obj;
    if(isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
    if("function" == typeof(obj)) return thunkToPromise.call(this, obj);
    if(Array.isArray(obj)) return arrayToPromise.call(this, obj);
    if(isObject(obj)) return objectToPromise.call(this, obj);
    return obj;
};

function isPromise(obj) {
    return "function" == typeof(obj.then);
};

function isGenerator(obj) {
    return "function" == typeof(obj.next) && "function" == typeof(obj.throw);
};

function isGeneratorFunction(obj) {
    var constructor = obj.constructor;
    if(!constructor) return false;
    if("GeneratorFunction" === constructor.name || "GeneratorFunction" === constructor.displayName) return true;
    return isGenerator(constructor.prototype);
};

function isObject(val) {
    return Object == val.constructor;
};


function Promise(fn) {
    var state     = "pending";
    var value     = null;
    var callbacks = [];

    this.then = function(onFulfilled, onRejected) {
        return new Promise(function(resolve, reject){
            handle({
                onFulfilled: onFulfilled || null,
                onRejected:   onRejected || null,
                resolve:      resolve,
                reject:       reject
            });
        });
    };

    function handle(callback) {
        if("pending" === state) {
            callbacks.push(callback);
            return;
        }
        var cb = ("fulfilled" === state ? callback.onFulfilled : callback.onRejected);
        var ret;
        if(null === cb) {
            cb = ("fulfilled" === state ? callback.resolve : callback.reject);
            cb(value);
            return;
        }
        ret = cb(value);
        callback.resolve(ret);
        /*
        * 异常处理
        try {
            ret = cb(value);
            callback.resolve(ret);
        } catch (e) {
            callback.reject(e);
        }
        */
    };

    function resolve(newValue) {
        if(newValue && ("object" === typeof(newValue) || "function" === typeof(newValue))) {
            var then = newValue.then;
            if("function" === typeof(then)) {
                then.call(newValue, resolve, reject);
                return;
            }
        }
        state = "fulfilled";
        value = newValue;
        execute();
    };

    function reject(reason) {
        state = "rejected";
        value = reason;
        execute();
    };

    function execute() {
        setTimeout(function(){
            callbacks.forEach(function(callback) {
                handle(callback);
            })
        }, 0);
    };

    fn(resolve, reject);
}














