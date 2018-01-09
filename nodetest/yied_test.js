"use strict";

function* outer() {
    yield "begin";
    yield inner();
    yield "end";
};

function* inner() {
    yield "inner";
};

var it = outer();
console.dir(it.next());