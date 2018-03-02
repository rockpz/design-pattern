"use strict";

function doSomething(i) {
    console.log(`doing ${i}`);
};

function doLoop() {
    for(let i = 0; i < 9; i++) {
        doSomething(i);
    }
};


function cpsDoSomething(i, ctn) {
    console.log(`doing ${i}`);
    ctn();
};

function cpsDoLoop() {
    doLoopStartingAt(0);

    function doLoopStartingAt(i) {
        if(i < 9) {
            cpsDoSomething(i, function(){
                doLoopStartingAt(i+1);
            });
        }
    };
};