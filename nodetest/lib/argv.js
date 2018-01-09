"use strict";

//
var argv = process.argv.slice(2);

module.exports = {};

for (var i in argv) {
    var [k, v] = argv[i].split('=');
    module.exports[k] = v;
}
