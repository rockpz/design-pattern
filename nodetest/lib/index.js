// 自动加载本目录下所有非index.js文件, 实现lib目录化
var ms = {};
app.fs.readdirSync(__dirname).forEach(function(file_name){
	if (file_name == 'index.js') return;
	if (file_name.indexOf('.') === 0) return; //不读取隐藏文件
    console.debug('loading...'+file_name);
	ms[file_name.replace('.js','')] = require(__dirname + '/' + file_name);
});
module.exports = ms;
