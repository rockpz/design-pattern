"use strict";

console.log("test client!!!!!!!!");

var uid = 11;
var uid2 = 13;
var sesskey = "";
var sessid = "123456789";
var tid = 0;

require('json-comments');

global.fs   = require('fs');
global.util = require('util');

var app = global.app = global.game = require(__dirname + '/dojs/do.js').create();
require('./config');

global.argv = app.argv = app.lib.argv;
app.argv.debug = app.shared_config.debug;




app.bootItem(function (next) {//绑定模型
    app.configPath(app.path.resolve(__dirname + '/configs'));
    app.modelPath(app.path.resolve(__dirname + '/models'));
    next();
});

app.bootItem(
    /**
     * 链接MYSQL
     * @param {function} next action in queue
     * @return nothing
     */
    function (next) {
        app.mc       = app.lib.memcached.create(app.shared_config.mc)();
        app.mysql    = app.lib.mysql.mysql(app.shared_config.mysql, function () {
            console.log('mysql connected.');
            next();
        })();
});

app.bootItem(function (next) {
    app.okeys   = app.model("okeys");
    app.otables = app.model("otables");
    var Ocache  = app.model("Ocache");
    app.ocache  = new Ocache();
    app.ocache.init(app.shared_config.mc_sets);
    app.ocache.initRedis(app.shared_config.redis_sets);

    var Ologs = app.model("Ologs");
    app.ologs = new Ologs();
    app.of    = app.model().ofunctions;

    next();
});





app.middle(
    /**
     * 中间件 initRequest
     * @param {function} next  action in queue
     * @param {dataChunk} req from client
     * @return nothing
     */
    function (next, req) {
        var cmd, data = null;
        if(!req || req.length !=3) return next();
        data = {};
        cmd = data.cmd = req[0] || '';
        data.data = req[1] || {};
        data.context = req[2] || {};

        if(!data.context) return next();

        if(!data.context.uid) return next();

        next();

    });

//开始引导
app.boot(function () {
    console.log('引导成功');

});


var encrypt =function ( dat,st_pos ){
    st_pos = st_pos || 13;
    if(st_pos - 0 != st_pos || st_pos.length <= 0 ){
        return null;
    }
    if( !dat || !Buffer.isBuffer( dat ) || (dat.length < st_pos) ){
        return null;
    }

    var SENDMAP = [
                    0xF7,0x86,0xFE,0xB4,0x39,0x22,0xF3,0xF2,0xE6,0x8F,0x4C,0x0C,0xE7,0x0B,0xE9,0x45,
                    0x5D,0x36,0x27,0x9A,0xB2,0x47,0x69,0x53,0x93,0x20,0xC2,0xD2,0x7A,0x34,0x89,0x16,
                    0x31,0x1E,0x94,0xFC,0xD3,0x98,0x32,0x37,0xE8,0x72,0x9E,0xDC,0xA2,0x99,0x80,0xA4,
                    0x7D,0x24,0x0F,0xA6,0x2E,0x52,0xE0,0x44,0x46,0x7E,0x60,0x3E,0xB1,0x7F,0x0A,0x28,
                    0x2B,0x1F,0x9F,0x05,0x56,0xB6,0x15,0x01,0xA0,0xB9,0xCF,0x40,0xEF,0xCA,0x82,0xE3,
                    0xD7,0x7B,0x78,0xB3,0x79,0x97,0xCE,0x83,0x33,0xAA,0x51,0x68,0x04,0xAD,0x77,0x09,
                    0x9D,0xD6,0x13,0x65,0x6F,0xDF,0x17,0xBF,0x71,0x84,0x67,0xF1,0x76,0x8E,0x64,0x07,
                    0xC4,0x4E,0xE1,0xA5,0x66,0xC6,0xB0,0x87,0x81,0x57,0x96,0x49,0xBE,0xBD,0x1D,0x41,
                    0x70,0x55,0x85,0x5B,0xD5,0xB5,0xF8,0xC1,0x5E,0xA3,0x18,0xC0,0xED,0x26,0x90,0xFF,
                    0xAC,0xD9,0xDE,0x30,0x75,0x61,0xC8,0x8B,0x03,0xC5,0x3F,0x6C,0xC7,0x02,0x4F,0xA1,
                    0x1A,0xD0,0x29,0x00,0x5A,0x06,0xFA,0x58,0x3C,0x1C,0x0E,0xB7,0xA7,0x88,0x3B,0xEB,
                    0x48,0x4B,0x6A,0xDD,0xBC,0xD8,0xCB,0x2D,0x95,0xD1,0xAB,0xCC,0xF0,0xF6,0x74,0x92,
                    0xBB,0x2F,0xF9,0x1B,0xBA,0x8D,0xFB,0xF5,0xAE,0x9C,0x23,0x2C,0x54,0xE2,0xEA,0x63,
                    0x4D,0x11,0xCD,0x3A,0xB8,0xC3,0x6D,0xE4,0xFD,0x42,0x4A,0x5C,0x2A,0xEE,0x59,0xDA,
                    0xA8,0x25,0x50,0x5F,0x8A,0x19,0x6E,0xEC,0x38,0x14,0x7C,0x62,0x21,0x8C,0x0D,0x08,
                    0xA9,0xAF,0xF4,0x3D,0x9B,0x91,0xC9,0x10,0x6B,0x73,0xDB,0x12,0x43,0xD4,0xE5,0x35
                                ];
    for( var i = 0; i < dat.length; i++ ){
        dat[i+st_pos] = SENDMAP[dat[i+st_pos]];
    }
    return dat;
};


var sendData = function (cmd, data) {
        var self = this;
        if(!Array.isArray(data)) return;
        if(!cmd) return;
        var s = new app.lib.SocketPacket();
        s.writeBegin(cmd);
        data.forEach(function (d) {
                if(!d.type) return;
                switch(d.type){
                        case "string":
                                if(typeof d.value == "object") d.value = JSON.stringify(d.value);
                                s.writeString(d.value);
                                break;
                        case "int" : s.writeInt(d.value); break;
                        case "short": s.writeShort(d.value); break;
                        case "int64": s.writeUInt64(d.value); break;
                }
        });
        if(cmd != 1000) console.debug("[sendData][%d][%d][%d][%s]", cmd, self.uid |0, self.UUID, JSON.stringify(data));
        self.write(encrypt(s.end()));
        console.log("send message susscess ", cmd)
        s = null;
};



app.ocache.minfo(uid).set(sesskey, sessid, function (err, data) {
    if(!!err) console.log(err);
    var net = require('net');
    var client = net.connect({ port: 16666, host: '127.0.0.1'}, function(){
        console.log('connect server success!!!!!!!!!!');
        var data = [];
        data.push({type: 'int', value: 11});
        data.push({type: 'string', value: "123456789"});
        sendData.call(client, 10001, data);
    });           
});






