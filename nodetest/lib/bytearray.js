"use strict";
/**
 * Created by RogerZhang on 2014/9/2.
 * npm install 安装的bytearray采用 BIG ENDIAN 方法，此类已经修改为 LITTLE endian方法 by RogerZhang
 *
 *
 # a collection of utility methods for Buffer
 #
 # 这个工具类的设计以实现两个目地
 # 1. 读写方法，匹配 Actionscript 的 ByteArray 读写方法
 # 2. ActionScript 的默认采用 LITTLE endian，这个工具方法，对此进行封装，以是外部不用关心 endian
 #
 */

//var Int64 = require('int64-native');
module.exports = {
    readUTF: function(buf, offset) {
        var len;
        if (!Buffer.isBuffer(buf)) {
            return null;
        }
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        if (buf.length <= offset + 4) {
            return null;
        }
        len = buf.readUInt32LE(offset);
        if (buf.length < len + offset) {
            return null;
        }
        offset += 4;
        buf.position = offset + len;
        return buf.toString('utf8', offset, offset + len);
    },
    readUTFBytes: function(buf, length, offset) {
        if (!Buffer.isBuffer(buf)) {
            return null;
        }
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        if (buf.length <= offset) {
            return null;
        }
        buf.position = offset + length;
        return buf.toString('utf8', offset, offset + length);
    },
    readFixLengthASCII: function(buf, offset) {
        var len;
        if (!Buffer.isBuffer(buf)) {
            return null;
        }
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        if (buf.length <= offset + 2) {
            return null;
        }
        len = buf.readUInt8(offset);
        if (buf.length < len + offset) {
            return null;
        }
        offset += 1;
        buf.position = offset + len;
        return buf.toString('utf8', offset, offset + len);
    },
    readUnsignedShort: function(buf, offset) {
        if (!Buffer.isBuffer(buf)) {
            return 0;
        }
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.position = offset + 2;
        return buf.readUInt16LE(offset);
    },
    readShort: function(buf, offset) {
        if (!Buffer.isBuffer(buf)) {
            return 0;
        }
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.position = offset + 2;
        return buf.readInt16LE(offset);
    },
    readUnsignedByte: function(buf, offset) {
        if (!Buffer.isBuffer(buf)) {
            return 0;
        }
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.position = offset + 1;
        return buf.readUInt8(offset);
    },
    readByte: function(buf, offset) {
        if (!Buffer.isBuffer(buf)) {
            return 0;
        }
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.position = offset + 1;
        return buf.readInt8(offset);
    },
    readUnsignedInt: function(buf, offset) {
        if (!Buffer.isBuffer(buf)) {
            return 0;
        }
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.position = offset + 4;
        return buf.readUInt32LE(offset);
    },
    readInt: function(buf, offset) {
        if (!Buffer.isBuffer(buf)) {
            return 0;
        }
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.position = offset + 4;
        return buf.readInt32LE(offset);
    },
    readFloat: function(buf, offset) {
        if (!Buffer.isBuffer(buf)) {
            return 0;
        }
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.position = offset + 4;
        return buf.readFloatLE(offset);
    },
    readUnsignedIntArray: function(buf, offset) {
        var a, arr, len;
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        len = buf.readUInt16LE(offset) >>> 2;
        offset += 2;
        arr = [];
        if (len === 0 || len > 1024) {
            buf.position = offset;
            return arr;
        }
        while (len > 0) {
            a = buf.readUInt32LE(offset);
            arr.push(a);
            offset += 4;
            len -= 1;
        }
        buf.position = offset;
        return arr;
    },
    writeUnsignedInt: function(buf, value, offset) {
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.writeUInt32LE(value, offset);
        buf.position = offset + 4;
    },
    writeInt: function(buf, value, offset) {
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.writeInt32LE(value, offset);
        buf.position = offset + 4;
    },
    writeFloat: function(buf, value, offset) {
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.writeFloatLE(value, offset);
        buf.position = offset + 4;
    },
    writeUnsignedShort: function(buf, value, offset) {
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.writeUInt16LE(value, offset);
        buf.position = offset + 2;
    },
    writeShort: function(buf, value, offset) {
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.writeInt16LE(value, offset);
        buf.position = offset + 2;
    },
    writeUnsignedByte: function(buf, value, offset) {
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.writeUInt8(value, offset);
        buf.position = offset + 1;
    },
    writeByte: function(buf, value, offset) {
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.writeInt8(value, offset);
        buf.position = offset + 1;
    },
    writeBoolean: function(buf, value, offset) {
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        value = value ? 1 : 0;
        buf.writeInt8(value, offset);
        buf.position = offset + 1;
    },
    writeFixLengthASCII: function(buf, str, maxNumOfChar, offset) {
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.writeUInt8(maxNumOfChar, offset);
        offset += 1;
        buf.fill(0x20, offset, offset + maxNumOfChar);
        buf.write(str, offset, maxNumOfChar, 'ascii');
        buf.position = offset + maxNumOfChar;
    },
    writeFixLengthUTF: function(buf, str, maxNumOfChar, offset) {
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        maxNumOfChar *= 6;
        buf.writeUInt16LE(maxNumOfChar, offset);
        offset += 2;
        buf.fill(0x20, offset, offset + maxNumOfChar);
        buf.write(str, offset, maxNumOfChar, 'utf8');
        buf.position = offset + maxNumOfChar;
    },
    writeUTF: function(buf, str, offset) {
        var byteLength;
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        byteLength = Buffer.byteLength(str);
        buf.writeUInt32LE(byteLength, offset);
        offset += 4;
        buf.write(str, offset);
        buf.position = offset + byteLength;
    },
    writeUTFBytes: function(buf, str, offset) {
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.write(str, offset);
        buf.position = offset + Buffer.byteLength(str);
    },
    writeUTFArray: function(buf, strArray, offset) {
        var byteLength, str, _i, _len;
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        if (!((strArray != null) && strArray.length > 0)) {
            buf.writeUInt16LE(0, offset);
            buf.position = offset + 2;
            return;
        }
        buf.writeUInt16LE(strArray.length, offset);
        offset += 2;
        for (_i = 0, _len = strArray.length; _i < _len; _i++) {
            str = strArray[_i];
            byteLength = Buffer.byteLength(str);
            buf.writeUInt16LE(byteLength, offset);
            offset += 2;
            buf.write(str, offset);
            offset += byteLength;
        }
        return buf.position = offset;
    },
    getByteLengthOfUTFArray: function(strArray) {
        var len, str, _i, _len;
        len = 2;
        if (!((strArray != null) && strArray.length > 0)) {
            return len;
        }
        for (_i = 0, _len = strArray.length; _i < _len; _i++) {
            str = strArray[_i];
            len = len + 2 + Buffer.byteLength(str);
        }
        return len;
    },
    writeUnsignedIntArray: function(buf, arr, fixedLength, offset) {
        var i, n, _i, _len;
        if (fixedLength == null) {
            fixedLength = -1;
        }
        arr = arr || [];
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        n = arr.length;
        if (fixedLength > 0 && fixedLength !== n) {
            if (fixedLength < n) {
                arr = arr.slice(0, fixedLength);
            } else {
                arr = arr.concat();
                arr.length = fixedLength;
            }
            n = fixedLength;
        }
        n = n << 2;
        buf.writeUInt16LE(n, offset);
        offset += 2;
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
            i = arr[_i];
            buf.writeUInt32LE(parseInt(i, 10) || 0, offset);
            offset += 4;
        }
        buf.position = offset;
    },
    getByteLengthOfIntArray: function(arr) {
        return (arr.length << 2) + 2;
    },
    writeUnsignedShortArray: function(buf, arr, fixedLength, offset) {
        var i, n, _i, _len;
        if (fixedLength == null) {
            fixedLength = -1;
        }
        arr = arr || [];
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        n = arr.length;
        if (fixedLength > 0 && fixedLength !== n) {
            if (fixedLength < n) {
                arr = arr.slice(0, fixedLength);
            } else {
                arr = arr.concat();
                arr.length = fixedLength;
            }
            n = fixedLength;
        }
        n = n << 1;
        buf.writeUInt16LE(n, offset);
        offset += 2;
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
            i = arr[_i];
            buf.writeUInt16LE(parseInt(i, 10) || 0, offset);
            offset += 2;
        }
        buf.position = offset;
    },
    getBytesAvailable: function(buf) {
        if (buf != null) {
            return buf.length - (buf.position || 0);
        } else {
            return 0;
        }
    },
    scrap: function(buf, length) {
        var offset, result;
        if (!((buf != null) && length > 0)) {
            return null;
        }
        offset = buf.position || 0;
        if (length + offset > buf.length) {
            return null;
        }
        result = new Buffer(length);
        buf.copy(result, 0, offset, offset + length);
        buf.position = offset + length;
        return result;
    },
    duplicate: function(buf) {
        var n, result;
        n = buf.length || 0;
        if (n === 0) {
            return null;
        }
        result = new Buffer(n);
        buf.copy(result, 0, 0, n);
        return result;
    },
    utfStringToBuf: function(str) {
        var buf, n;
        str = String(str || '');
        n = Buffer.byteLength(str, 'utf8');
        buf = new Buffer(n + 2);
        buf.writeUInt16LE(n, 0);
        buf.write(str, 2);
        return buf;
    },
    isAvailableBuf: function(buf) {
        return Buffer.isBuffer(buf) && buf.length > 0;
    },
    writeIntArray: function(buf, arr, fixedLength, offset) {
        var i, n, _i, _len;
        if (fixedLength == null) {
            fixedLength = -1;
        }
        arr = arr || [];
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        n = arr.length;
        if (fixedLength > 0 && fixedLength !== n) {
            if (fixedLength < n) {
                arr = arr.slice(0, fixedLength);
            } else {
                arr = arr.concat();
                arr.length = fixedLength;
            }
            n = fixedLength;
        }
        n = n << 2;
        buf.writeUInt16LE(n, offset);
        offset += 2;
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
            i = arr[_i];
            buf.writeInt32LE(parseInt(i, 10) || 0, offset);
            offset += 4;
        }
        buf.position = offset;
    },

    writeUInt64: function(buf, value, offset) {
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        value = 0; //new Int64(value);
        buf.writeUInt32LE(value.low32(), offset);
        buf.writeUInt32LE(value.high32(), offset + 4);
        buf.position = offset + 8;

        // buf.writeUInt32LE(value.low32(), offset, noAssert);
        // buf.writeUInt32LE(value.high32(), offset + 4, noAssert);
    },

    readUInt64: function(buf, offset) {
        if (!Buffer.isBuffer(buf)) {
            return 0;
        }
        offset = offset < 0 ? buf.length + offset : (offset === 0 ? 0 : offset || buf.position || 0);
        buf.position = offset + 8;
        var low = buf.readUInt32LE(offset);
        var high= buf.readUInt32LE(offset+4);
        // var v = new Int64(high, low);
        // return v.valueOf();
        return low | high << 32;
    },
};
