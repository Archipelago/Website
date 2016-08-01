let fs = require('fs');

module.exports = function(app) {
  fs.readdirSync('./routes').filter(function(file) {
    return file.match(/^(?!\.).*\.js(?!~)$/) && file !== 'index.js';
  }).forEach(function(file) {
    require('./' + file)(app);
  });
}
