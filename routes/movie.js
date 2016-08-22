let async = require('async');
let apiRequest = require('../api_request');

module.exports = function(app) {
  app.get('/movie/:id', function(req, res) {
    apiRequest(req, res, 'get', '/movie/' + req.params.id, function(e, r, bodyMovie) {
      if (r.statusCode === 200) {
	let movie = {
	  image: bodyMovie.image,
	  title: bodyMovie.title
	};
	delete bodyMovie.image;
	delete bodyMovie.title;
	movie.data = bodyMovie;
	apiRequest(req, res, 'get', '/movie/' + req.params.id + '/releases', function(e, r, releases) {
	  async.each(releases, function(release, cb) {
	    apiRequest(req, res, 'get', '/video_release/' + release.id + '/links', function(e, r, links) {
	      release.links = links;
	      cb();
	    });
	  }, function() {
	    movie.releases = releases;
	    res.renderView('movie', {movie: movie});
	  });
	});
      }
      else {
	token.setMessage(req, 'error', bodyMovie.message);
	res.renderDefaultPage(req, res);
      }
    });
  });

  app.get('/movie', function(req, res) {
    // TODO: redirect if permissions failure
    res.renderView('movie_add', {currentYear: (new Date).getFullYear()});
  });
}
