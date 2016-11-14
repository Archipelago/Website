let apiRequest = require('../api_request');

module.exports = function(app) {
  app.get('/movie/:id/release', function(req, res) {
    apiRequest(req, res, 'get', '/lists', function(e, r, b) {
      // TODO: redirect if permissions failure
      res.renderView('release_add', {movie_id: req.params.id, lists: b});
    });
  });
};
