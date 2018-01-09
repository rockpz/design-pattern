"use strict";
/**
 * Created by RogerZhang on 2014/9/2.
 */

var byteArr = require('./bytearray');


function SocketPacket(data)
{
    console.log(this);
    this._version = 1;
    this._subVersion = 1;
    this._packet_head_size = 13;
    this.bodyLength = 0;

    this.data = data;
    if (data) this.bodyLength = data.length - this._packet_head_size;
}


SocketPacket.prototype.readCmd = function()
{
    var cmd = byteArr.readShort(this.data, 2);
    this.data.position = this._packet_head_size;
    return cmd;
};



SocketPacket.prototype.writeBegin = function(cmd)
{
    this.cmd = cmd;
    this.bufferArray = [];
    this.bodyLength = 0;
    return this;
};

SocketPacket.prototype.readByte = function()
{
    return byteArr.readByte(this.data);
};
SocketPacket.prototype.readUByte = function()
{
    return byteArr.readUnsignedByte(this.data);
};

SocketPacket.prototype.readBoolean = function()
{
    return byteArr.readByte(this.data) > 0;
};

SocketPacket.prototype.readInt = function()
{
    return byteArr.readInt(this.data);
};

SocketPacket.prototype.readUInt = function()
{
    return byteArr.readUnsignedInt(this.data);
};

SocketPacket.prototype.readShort = function()
{
    return byteArr.readShort(this.data);
};


SocketPacket.prototype.readString = function()
{
    return byteArr.readUTF(this.data);
};


SocketPacket.prototype.writeByte = function(b)
{
    var bt = new Buffer(1);
    byteArr.writeByte(bt, b);
    this.bufferArray.push(bt);
    this.bodyLength++;
    return this;
};

SocketPacket.prototype.writeBoolean = function(b)
{
    var bt = new Buffer(1);
    byteArr.writeBoolean(bt, b);
    this.bufferArray.push(bt);
    this.bodyLength++;
    return this;
};

SocketPacket.prototype.writeInt = function(i)
{
    var bt = new Buffer(4);
    byteArr.writeInt(bt, i);
    this.bufferArray.push(bt);
    this.bodyLength += 4;
    return this;
};

SocketPacket.prototype.writeUInt = function(i)
{
    var bt = new Buffer(4);
    byteArr.writeUnsignedInt(bt, i);
    this.bufferArray.push(bt);
    this.bodyLength += 4;
    return this;
};

SocketPacket.prototype.writeShort = function(i)
{
    var bt = new Buffer(2);
    byteArr.writeShort(bt, i);
    this.bufferArray.push(bt);
    this.bodyLength += 2;
    return this;
};

SocketPacket.prototype.writeString = function(str)
{
    var len = Buffer.byteLength(str);
    var bt = new Buffer(len + 4);
    byteArr.writeUTF(bt, str);
    this.bufferArray.push(bt);
    this.bodyLength += (len + 4);
    return this;
};


SocketPacket.prototype.readUInt64 = function()
{
    return byteArr.readUInt64(this.data);
};

SocketPacket.prototype.writeUInt64 = function(i)
{
    var bt = new Buffer(8);
    byteArr.writeUInt64(bt, i);
    this.bufferArray.push(bt);
    this.bodyLength += 8;
    return this;
};


SocketPacket.prototype.end = function()
{
    var head = new Buffer(this._packet_head_size);
    byteArr.writeUTFBytes(head, "YH");
    byteArr.writeShort(head, this.cmd);
    byteArr.writeByte(head, this._version);
    byteArr.writeByte(head, this._subVersion);
    byteArr.writeShort(head, this.bodyLength);
    byteArr.writeByte(head, 0);
    byteArr.writeInt(head, 0);

    this.bufferArray.unshift(head);
    this.data = Buffer.concat(this.bufferArray);
    return this.data;
};

SocketPacket.prototype.getBuff = function()
{
    return this.data;
};


SocketPacket.prototype.parsePacket = function () {
    if (this.data.length < this._packet_head_size) return false;
    if (this.data[0] != 0x59 || this.data[1] != 0x48) {
        console.error(" parse packet err %d %d", this.data[0], this.data[1]);
        return false;
    }

    if (this.data[4] != this._version || this.data[5] != this._subVersion) return false;
    this.data.position = 2;
    var cmd = byteArr.readShort(this.data);
    if (cmd <= 0 || cmd >= 32000){
        console.error("packet cmd out of range");
        return false;
    }

    this.data.position = 6;
    var len = byteArr.readShort(this.data);
    if (len >=0 && len > this.data.length - this._packet_head_size){
        console.error(" packet data Length Error");
        return false;
    }

    this.data.position = this._packet_head_size;
    return true;
};

module.exports = SocketPacket;