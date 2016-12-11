let apiRequest = require('../api_request');

module.exports = function(app) {
  app.get('/movie/:id/release', function(req, res) {
    apiRequest(req, res, 'get', '/lists', function(e, r, b) {
      // TODO: redirect if permissions failure
      res.renderView('release_add', {movie_id: req.params.id, lists: b});
    });
  });

  app.post('/movie/:id/release', function(req, res) {
    apiRequest(req, res, 'post', '/movie/' + req.params.id + '/release', function(e, r, b) {
      if (r.statusCode === 201) {
	token.setMessage(req, 'success', 'Release "' + req.body.name + '" successfully added');
	res.redirect('/movie/' + req.params.id);
      }
      else
	res.redirect('/movie/' + req.params.id + '/release');
    });
  });
};
