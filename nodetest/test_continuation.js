var fs = require('fs');

for (var i = 0; i < 4; i++) {
  fs.readFile('a.log', 'utf-8', obtain(text));
  console.log(text);
}

console.log('Done');