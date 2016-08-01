let apiRequest = require('../api_request');

module.exports = function(app) {
  app.get('/', function(req, res) {
    apiRequest(req, res, 'get', '/movies/last/15', function(e, r, b) {
      if (r.statusCode === 200) {
	res.renderView('home', {movies: JSON.parse(b)});
      }
    });
  });
}
