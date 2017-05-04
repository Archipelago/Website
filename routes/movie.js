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
	    res.renderView('movie', {movie: movie, id: req.params.id});
	  });
	});
      }
      else {
	res.renderDefaultPage(req, res);
      }
    });
  });

  app.get('/movie', function(req, res) {
    // TODO: redirect if permissions failure
    res.renderView('movie_add', {currentYear: (new Date).getFullYear()});
  });

  app.post('/movie', function(req, res) {
    let fields = ['director', 'gender', 'producer', 'scriptwriter', 'actor', 'composer'];
    for (let i in fields)
      if (req.body[fields[i]])
	req.body[fields[i]] = req.body[fields[i]].split(/\s*,\s*/g);
    apiRequest(req, res, 'post', '/movie', function(e, r, b) {
      if (r.statusCode === 201) {
	token.setMessage(req, 'success', 'Movie "' + req.body.title + '" successfully added');
	res.renderDefaultPage(req, res);
      }
      else {
	res.renderView('movie_add', {currentYear: (new Date).getFullYear()});
      }
    });
  });
}
