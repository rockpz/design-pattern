"use strict";

exports.name = 'logs';
exports.log = function (path, logs, level, cb) {
    cb = cb || function () {
    }
    level = level || 0;
    if ('string' != typeof logs) {
        logs = JSON.stringify(logs);
    }
//    logs='====================Data:'+Date()+'=Level:'+level+'======================\n'+logs+'\n\n';
    logs = ((Date.now() / 1000) | 0) + '|||' + level + '|||' + Date() + '|||' + logs + '\n';
    global.fs.appendFile(path, logs, cb);
};
