let request = require('request');

module.exports = function(req, res, type, route, cb) {
  request[type]({url: ('http://localhost:8080' + route),
		 form: JSON.stringify(req.body)},
		function(e, r, b) {
		  if (r.statusCode / 100 === 4)
		    res.viewData.errors.push(JSON.parse(b).message);
		  res.statusCode = r.statusCode;
		  cb(e, r, b);
		});
}
