"use strict";

var net = require("net");


console.log(`server established ${process.pid}`);

var sc = net.createServer(function(io){
    io.setTimeout(6000);
    io.on("data", function(data) {
        console.log(data);
    });
    io.on("close", function(){
        console.log(`client closed!`);
        io.destroy();
    });
    io.on("error", function(err){
        console.log(`err: ${err.message}`);
        io.destroy();
    });
    io.on("timeout", function(){
        console.log(`client timeout`);
        io.destroy();
        //io.end();
    });
    io.on("connect", function(){
        console.log(`client connected`);
    });
});

sc.listen(11111);