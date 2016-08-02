let request = require('request');

module.exports = function(req, res, type, route, cb) {
  request[type]({url: ('http://localhost:8080' + route),
		 form: JSON.stringify(req.body)},
		function(e, r, b) {
		  b = JSON.parse(b);
		  if (r.statusCode / 100 === 4)
		    token.setMessage(req, 'error', b.message);
		  else if (r.statusCode !== 200)
		    res.statusCode = r.statusCode;
		  cb(e, r, b);
		});
}
