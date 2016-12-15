let apiRequest = require('../api_request');

module.exports = function(app) {
  app.get('/movie/:id/release', function(req, res) {
    apiRequest(req, res, 'get', '/lists', function(e, r, b) {
      // TODO: redirect if permissions failure
      res.renderView('release_add', {movie_id: req.params.id, lists: b});
    });
  });

  app.post('/movie/:id/release', function(req, res) {
    let links = [];
    let name = req.body.name;
    for (i in req.body) {
      if (i.match(/^links|\d+$/)) {
	let splits = req.body[i].split(/\r?\n/g);
	links.push(splits.length == 1 ? splits[0] : splits);
	delete req.body[i];
      }
    }
    apiRequest(req, res, 'post', '/movie/' + req.params.id + '/release', function(e, r, b) {
      if (r.statusCode === 201) {
	req.body = links;
	apiRequest(req, res, 'post', '/video_release/' + b.id + '/link', function(e, r, b) {
	  if (r.statusCode === 201) {
	    token.setMessage(req, 'success', 'Release "' + name + '" and links successfully added');
	    res.redirect('/movie/' + req.params.id);
	  }
	  else
	    res.redirect('/movie/' + req.params.id + '/release');
	});
      }
      else
	res.redirect('/movie/' + req.params.id + '/release');
    });
  });
};
