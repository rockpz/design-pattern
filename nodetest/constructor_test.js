"use strict";

function Type() {};

var types = [
    new Array,
    [],
    new Boolean,
    true,
    new Date,
    new Error,
    new Function,
    function(){},
    Math,
    new Number,
    1,
    new Object,
    {},
    new RegExp,
    /(?:)/,
    new String,
    "test"
];

for(var i = 0; i < types.length; i++){
    //types[i].constructor = Type || types[i].constructor;
    types[i] = [types[i].constructor, types[i] instanceof Type, types[i].toString()];
};

console.log(types.join("\n"));






