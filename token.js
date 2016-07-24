module.exports = function() {
  // token: login
  let tokens = {};

  this.getLogin = function(t) {
    return users[tokens[t]].login;
  }

  this.authenticate = function(token, login) {
    login = login.trim();
    tokens[token] = {
      login: login
    };
  }

  this.isAuthenticated = function(req) {
    return tokens[req.cookies.Token] !== undefined;
  }

  this.checkAuthentication = function(req, res, next) {
    if (req.cookies.token === undefined
	|| tokens[req.cookies.token] === undefined) {
      res.statusCode = 401;
      res.viewData.errors.push('You need to be logged in to access this page');
      res.renderView('/register');
    }
    else
      next(req, res);
  }
}
