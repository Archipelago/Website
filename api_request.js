let request = require('request');

module.exports = function(req, type, route, cb) {
  request[type]({url: ('http://localhost:8080' + route),
		 form: JSON.stringify(req.body)},
		function(e, r, b) {
		  cb(e, r, b);
		});
}
