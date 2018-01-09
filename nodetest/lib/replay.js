var fs = require('fs');
var path = require('fs');

function Replayer(options) {
    this.currentHistory = [];
    this.logsDir = options.logsDir;
    this.express = options.express;
    this.speedx = options.speedx || 1;
    var currLogPath = path.resolve(this.logsDir, 'replay_'+Date.format('Y_m_d_h_m_s')+'.log');
}

Replayer.prototype.add = function(req) {
    this.currentHistory.push({time:Date.now(), req:req});
};

Replayer.prototype.save = function() {
    var historyStr = JSON.stringify(this.currentHistory);
    fs.writeFileSync(this.savePath, historyStr);
};

Replayer.prototype.lastLogPath = function() {
    var names = fs.readdirSync(this.logsDir);
    var logPaths = [];
    for (var i=0; i<names.length; i++) {
        if (names[i].indexOf('replay_') === 0)
            logPaths.push(path.resolve(this.logsDir, names[i]));
    }
    logPaths = logPaths.sort(function(a,b) { return a > b ? 1 : -1});
    return logPaths[0];
};

Replayer.prototype.replay = function(logsPath) {
    logsPath = logsPath || this.lastLogPath();
    var lastHistory = fs.readFileSync(logsPath);
    lastHistory = JSON.parse(lastHistory);

    var now = Date.now();
    var t0 = lastHistory[0].time;
    for (var i=0; i<lastHistory.length; i++) {
        var ti = lastHistory[i].time;
        this.delayPlay((ti - t0) / this.speedx, lastHistory[i].req);
    }
};

Replayer.prototype.replay = function(delay, req) {
    var timer = setTimeout(function() {
        clearTimeout(timer);
        console.dir(req);
    }, delay);
};

exports.replay = function(options) {
    return new Replayer(options);
};
