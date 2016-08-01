let apiRequest = require('../api_request');

module.exports = function(app) {
  // TODO: we must also retrieve releases and links
  app.get('/movie/:id', function(req, res) {
    apiRequest(req, res, 'get', '/movie/' + req.params.id, function(e, r, b) {
      b = JSON.parse(b);
      if (r.statusCode === 200) {
	let movie = {
	  image: b.image,
	  title: b.title
	};
	delete b.image;
	delete b.title;
	movie.data = b;
	res.renderView('movie', {movie: movie});
      }
      else
	res.renderDefaultPage(req, res);
    });
  });
}
