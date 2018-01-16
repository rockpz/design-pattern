"use strict";

/*
* 不同的场景，this的指向不同
* 全局范围内
* 函数调用
* 方法调用
* 调用构造函数
* 显式的设置this
****************************************************
* 在全局作用域中出现的this指全局对象，浏览器中是window对象
* this当前调用这个方法的对象
****************************************************
* apply  call   bind
*/
var foo = function() {
    var myName = "Foo Module";

    function sayhello() {
        console.log(myName);
    };

    this.bar = function() {
        setTimeout(sayhello, 1000);
    };
};

var f = new foo;
f.bar();