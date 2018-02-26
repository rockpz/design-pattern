"use strict";

//心跳消息
//用户登录
//php消息处理
//好友间聊天

// 设置sessionID

//package.json
//1.2.2  指定版本 
//~1.2.2 1.2.x的最新版本（不低于1.2.2) 
//^1.2.2 1.x.x的最新版本（不低于1.2.2） 
//latest 最新版本 
//mail 
//chalk


console.log(`process id is ${process.pid}`)
var net = require("net");

var uid = 77;
var sessionID = '123456789';

var memcached = require("memcached");
var memClient = new memcached("192.168.3.120:11211", {reconnect: 100, retries: 2, failures: 2, timeout: 300, failuresTimeout: 1000, minTimeout: 100});

var redis = require("redis");
var redisClient = redis.createClient(6379, "192.168.3.120");

var client = new net.Socket();

client.on('connect', function(){
    console.log(`client connect success`);
    //var msg = [{type: "int", value: uid}, {type: "string", value: sessionID}];
    //client.write(encrypt(msgPack(10001, msg).end()));
    var msg = [];
    msg.push({type: "int", value: 0});
    msg.push({type: "int", value: 3});
    msg.push({type: "string", value: "hello"});
    msg.push({type: "int", value: 0});
    msg.push({type: "string", value: [12001]});
    client.write(encrypt(msgPack(1004, msg).end()));
});

client.on('data', function(data){
    if (Buffer.isBuffer(client.buf_cache)){
        data = Buffer.concat([io.buf_cache, data]);
        client.buf_cache = null;
    }

    chunkBuffer(data, client, function (_data_) {
        _data_ = decrypt(_data_, 13);
        if (_data_.length >= self.dataMaxLength){
            console.error("tcp pack data > %d", self.dataMaxLength);
            return io.destroy();
        }
        try{
            processMsg(_data_, client);
        }catch(e99){
            console.error("tcp pack err YH-E99 "+e99.message+",dat_len:"+_data_.length + ", stack:" + e99.stack);
        }
    });
});

setSession(uid, function(){
    client.connect(9010, '192.168.3.120');
});

function processMsg(data, client) {

};

function setSession(uid, cb) {
    memClient.set(`MK_ND_SESSID${uid}`, sessionID, 259200, function(err){
        if(err) console.log(`${uid} set session failed!  reason: ${err.message}`);
        console.log(`${uid} set session success !`);
        if(cb && typeof(cb) == "function") cb(uid);
    });
};


function msgPack(cmd, data) {
    cmd = cmd | 0;
    if (!data || !Array.isArray(data)) {
        console.error("msgPack param error", cmd, data);
        return "";
    }
    var k = require("./lib/SocketPacket");
    console.log(k);
    var s = new k();
    s.writeBegin(cmd);
    data.forEach(function (d) {
        if (!d.type) return;
        switch (d.type) {
        case "string":
            if (typeof d.value == "object") d.value = JSON.stringify(d.value);
            s.writeString(d.value);
            break;
        case "int":
            s.writeInt(d.value);
            break;
        case "short":
            s.writeShort(d.value);
            break;
        case "int64":
            s.writeUInt64(d.value);
            break;
        }
    });
    console.log("msgpack ", typeof(s));
    return s;
};

function encrypt(dat, st_pos){
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

function decrypt ( dat, st_pos ){
    st_pos = st_pos || 13;
    if ((st_pos - 0 != st_pos) || (st_pos.length <= 0) ){
        return null;
    }

    if ( !dat || !Buffer.isBuffer( dat ) || (dat.length < st_pos) ){
        return null;
    }
    var RECIVEMAP=[
                    0xA3,0x47,0x9D,0x98,0x5C,0x43,0xA5,0x6F,0xEF,0x5F,0x3E,0x0D,0x0B,0xEE,0xAA,0x32,
                    0xF7,0xD1,0xFB,0x62,0xE9,0x46,0x1F,0x66,0x8A,0xE5,0xA0,0xC3,0xA9,0x7E,0x21,0x41,
                    0x19,0xEC,0x05,0xCA,0x31,0xE1,0x8D,0x12,0x3F,0xA2,0xDC,0x40,0xCB,0xB7,0x34,0xC1,
                    0x93,0x20,0x26,0x58,0x1D,0xFF,0x11,0x27,0xE8,0x04,0xD3,0xAE,0xA8,0xF3,0x3B,0x9A,
                    0x4B,0x7F,0xD9,0xFC,0x37,0x0F,0x38,0x15,0xB0,0x7B,0xDA,0xB1,0x0A,0xD0,0x71,0x9E,
                    0xE2,0x5A,0x35,0x17,0xCC,0x81,0x44,0x79,0xA7,0xDE,0xA4,0x83,0xDB,0x10,0x88,0xE3,
                    0x3A,0x95,0xEB,0xCF,0x6E,0x63,0x74,0x6A,0x5B,0x16,0xB2,0xF8,0x9B,0xD6,0xE6,0x64,
                    0x80,0x68,0x29,0xF9,0xBE,0x94,0x6C,0x5E,0x52,0x54,0x1C,0x51,0xEA,0x30,0x39,0x3D,
                    0x2E,0x78,0x4E,0x57,0x69,0x82,0x01,0x77,0xAD,0x1E,0xE4,0x97,0xED,0xC5,0x6D,0x09,
                    0x8E,0xF5,0xBF,0x18,0x22,0xB8,0x7A,0x55,0x25,0x2D,0x13,0xF4,0xC9,0x60,0x2A,0x42,
                    0x48,0x9F,0x2C,0x89,0x2F,0x73,0x33,0xAC,0xE0,0xF0,0x59,0xBA,0x90,0x5D,0xC8,0xF1,
                    0x76,0x3C,0x14,0x53,0x03,0x85,0x45,0xAB,0xD4,0x49,0xC4,0xC0,0xB4,0x7D,0x7C,0x67,
                    0x8B,0x87,0x1A,0xD5,0x70,0x99,0x75,0x9C,0x96,0xF6,0x4D,0xB6,0xBB,0xD2,0x56,0x4A,
                    0xA1,0xB9,0x1B,0x24,0xFD,0x84,0x61,0x50,0xB5,0x91,0xDF,0xFA,0x2B,0xB3,0x92,0x65,
                    0x36,0x72,0xCD,0x4F,0xD7,0xFE,0x08,0x0C,0x28,0x0E,0xCE,0xAF,0xE7,0x8C,0xDD,0x4C,
                    0xBC,0x6B,0x07,0x06,0xF2,0xC7,0xBD,0x00,0x86,0xC2,0xA6,0xC6,0x23,0xD8,0x02,0x8F
                                ];
    for( var i = 0; i < dat.length; i++ ){
        dat[i+st_pos] = RECIVEMAP[dat[i+st_pos]];
    }
    return dat;
};