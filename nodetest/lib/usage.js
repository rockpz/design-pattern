"use strict";
var fs = require('fs');


//获得LINUX进程表述文件中的信息
exports._fileGetCpuUsage = function(pid,cb){
    if (!pid){
        throw new Error('NO_PID');
    }else{
        fs.readFile("/proc/" + pid + "/stat", function(err, data){
            console.log(err,'usage');
            var elems = data.toString().split(' ');
            var utime = parseInt(elems[13]);
            var stime = parseInt(elems[14]);

            cb(utime + stime);
        });
    }
};
//CPU使用情况
exports.getCpu = function(cb,time,pid){

    time = time||1000;
    pid  = pid||process.pid;
    if (require('os').type() == 'Linux'){


        exports._fileGetCpuUsage(pid,function(startTime){

            setTimeout(function(){

                exports._fileGetCpuUsage(pid,function(endTime){
                    var delta = endTime - startTime;
                    var percentage = 100 * (delta / 10000);
                    cb(percentage,pid);
//                    if (percentage > 20){
//                        console.log("CPU Usage Over 20%!");
//                    }
                });

            }, time);

        });
    }else{
        cb(-1);
    }
};