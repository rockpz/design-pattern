"use strict";

/* co api
*  co.wrap(fn)
*  createPromise()
*  co(gen)
*  onFullfilled(res)
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














