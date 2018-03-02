//"use strict";

/*
* 不同的场景，this的指向不同
* 全局范围内
* 函数调用
* 方法调用
* 调用构造函数
* 显式的设置this
* 严格模式／非严格模式 new 显式函数／匿名函数／箭头函数  回调函数
* http://blog.csdn.net/w_vc_love/article/details/51012252
****************************************************
* 在全局作用域中出现的this指全局对象，浏览器中是window对象
* this当前调用这个方法的对象
****************************************************
* apply  call   bind
*/
//var foo = function() {
//    var myName = "Foo Module";
//
//    function sayhello() {
//        console.log(myName);
//    };
//
//    this.bar = function() {
//        setTimeout(sayhello, 1000);
//    };
//};
//
//var f = new foo;
//f.bar();

//exports.haha = 999;
//console.log(1111111111);
//console.log(this);
//var a = {
//    c: 8,
//    sitt: () => {
//        console.log(this);
//        return this.c;    
//    }
//};
//console.log(this);
//console.log(2222222222);
//a.sit = function () {
//    console.log(this);
//    return this.c;
//};
//
//let d = a.sitt();
//console.log(d);


function fn(){
    function fn2(){
        console.log(this);
        this.age = 18;
    }
    //fn2();
    //console.log(this); //global
    //console.log(this.age); //18
    //console.log(global.age); //18
    var cc = new fn2();
    console.log(cc.age);
}
fn();