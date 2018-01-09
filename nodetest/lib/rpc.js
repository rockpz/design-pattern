"use strict";

var http = require("http");
var Rpc = function (cfg) {
	this.host = cfg.host;
	this.port = cfg.port;

};

Rpc.prototype.call = function (act, data, cb){
	sendData.call(this, act, data, cb);
};
	
module.exports = {
	web: new Rpc({port:app.shared_config.web_port})
};



function sendData(cmd, data, cb) {
	cb = cb || function(){};
	var self = this;
	var req = http.request({
		host: self.host || "localhost",
		port: self.port || 80,
		method:"post",
		path: "/rpc",
		headers:{
			'Content-Type': 'application/json; charset=UTF-8'
		}
	}, function(res){
		// console.log('STATUS: ' + res.statusCode);
	 //    console.log('HEADERS: ' + JSON.stringify(res.headers));
	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
	    	cb(null, chunk);
	        // console.log('BODY: ' + chunk);
	    });
	});

	req.on('error', function (e) {
		cb(e, null);
	    console.log('problem with rpc request: ' + e.message);
	});

	var post = {
		cmd: cmd, 
		data: data
	};
	try{
		req.write(JSON.stringify(post));
	}catch(e){
		cb(e,null);
	}
	

	req.end();
}

