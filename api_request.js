let request = require('request');

module.exports = function(req, res, type, route, cb) {
  let options = {
    url: (config.api + route),
    form: JSON.stringify(req.body),
    headers: {}
  };

  if (token.isAuthenticated(req))
    options.headers.Token = token.getRemoteToken(req);

  request[type](options, function(e, r, b) {
    if (b === undefined) {
      token.setMessage(req, 'error', 'FATAL ERROR: unable to contact API');
      res.statusCode = 500;
      cb(e, res, b);
    }
    else {
      b = JSON.parse(b);
      if (parseInt(r.statusCode / 100) === 4)
	token.setMessage(req, 'error', b.message);
      else if (r.statusCode !== 200)
	res.statusCode = r.statusCode;
      cb(e, r, b);
    }
  });
}
