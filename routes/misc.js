let apiRequest = require('../api_request');

function defaultPage(req, res) {
  apiRequest(req, res, 'get', '/movies/last/15', function(e, r, b) {
    if (r.statusCode === 200) {
      res.renderView('home', {movies: JSON.parse(b)});
    }
  });
}

module.exports = function(app) {
  app.get('/', function(req, res) {
    defaultPage(req, res);
  });

  app.use(function(req, res, next) {
    res.statusCode = 404;
    defaultPage(req, res);
  });
}
