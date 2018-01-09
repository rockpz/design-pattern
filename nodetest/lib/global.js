

global.int = function(val) {
    let n = Number(val);
    if (!n) return 0;
    return parseInt(val);
}

global.str = function(val) {
    return ''+ val;
}

global.abs = Math.abs.bind(Math);

global.allTrue = function(...args) {
    for (let arg of args) {
        if (!arg) return false;
    }
    return true;
}
