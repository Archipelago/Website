let apiRequest = require('../api_request');

module.exports = function(app) {
  app.post('/register', function(req, res) {
    apiRequest(req, res, 'post', '/register', function(e, r, b) {
      if (r.statusCode === 201) {
	token.setMessage(req, 'success', 'You successfully registered');
	res.redirect(token.getLastPage(req));
      }
      else
	res.renderView('register');
    });
  });

  app.get('/logout', function(req, res) {
    token.logout(req);
    token.setMessage(req, 'success', 'You logged out');
    res.redirect(token.getLastPage(req));
  });

  app.post('/login', function(req, res) {
    apiRequest(req, res, 'post', '/login', function(e, r, b) {
      if (r.statusCode === 200) {
	token.authenticate(req, b.token, req.body.login);
	token.setMessage(req, 'success', 'You successfully logged in');
	res.redirect(token.getLastPage(req));
      }
      else
	res.renderView('register');
    });
  });

  app.get(['/register', '/login'], function(req, res) {
    if (token.isAuthenticated(req))
      res.redirect('/');
    else
      res.renderView('register');
  });
}
