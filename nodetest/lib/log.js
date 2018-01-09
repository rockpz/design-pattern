var log4js = require('log4js');

var log4js_opt = {
    "appenders": [
        // { "type": 'console' },
        {
            "type": "smtp",
            "recipients": ["wuguanfeng@yiihua.com", "chenguoxin@yiihua.com"],
            "sender": "srv-test@yiihua.com",
            "subject": app.shared_config.name + '服务器发生异常',
            "sendInterval": 1,
            "transport": "SMTP",
            "SMTP": {
                "host": "smtp.exmail.qq.com",
                "secureConnection": true,
                "port": 465,
                "auth": {
                    "user": "srv-test@yiihua.com",
                    "pass": "test123456"
                },
                "debug": false
            },
            "category": "mailer",
            "layout": {
                "type": "pattern",
                "pattern": "%d{ISO8601} (pid: %x{pid})%n%n%m%n%n%n",
                "tokens": {
                    "pid": function () { return process.pid; }
                }
            }
        }
    ]
};

exports.logger = function (name) {
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
}

exports.setMailRecipients = function(recipients) {
    log4js_opt.appenders[0].recipients = recipients;
    log4js_opt.appenders[0].subject = app.shared_config.name+'['+app.serverid+']' + '异常';
    log4js.configure(log4js_opt);
    exports.log4js = log4js;
    exports.logmailer = log4js.getLogger("mailer");
}

exports.error_report = function (err, data) {
    if (app.shared_config.log_mail) {
        if (typeof err == 'object') err = JSON.stringify(err);

        var msg = "\r\n\r\n";
        msg += "app: " + app._name + "\r\n\r\n";
        msg += "path: " + app._path + "\r\n\r\n";
        msg += "params: " + "\r\n\r\n";
        msg += "system_info: " + "\r\n\r\n";
        msg += "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\r\n\r\n";
        msg += err + "\r\n\r\n";
        msg += data + "\r\n\r\n";
        msg += "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\r\n\r\n";
        msg += err.stack || "";

        app.lib.log.logmailer.info(msg);
    }
}
