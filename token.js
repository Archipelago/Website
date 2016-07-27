let crypto = require('crypto');

module.exports = function() {
  // token: login, remote, messages, connected
  let tokens = {};

  this.authenticate = function(req, token, login) {
    tokens[req.cookies.Token].remote = token;
    tokens[req.cookies.Token].login = login.trim;
    tokens[req.cookies.Token].connected = true;
  }

  this.isAuthenticated = function(req) {
    return tokens[req.cookies.Token].connected;
  }

  this.checkAuthentication = function(req, res, next) {
    if (req.cookies.Token === undefined
	|| tokens[req.cookies.Token] === undefined
	|| tokens[req.cookies.Token].connected !== true) {
      res.statusCode = 401;
      tokens[req.cookies.Token].messages.errors.push('You need to be logged in to access this page');
      res.redirect('/register');
    }
    else
      next(req, res);
  }

  this.setMessage = function(req, type, content) {
    tokens[req.cookies.Token].messages[type].push(content);
  }

  this.mid = function(req, res, next) {
    if (req.cookies.Token
	&& tokens[req.cookies.Token] !== undefined) {
      if (tokens[req.cookies.Token].connected === true)
	req.connected = false;
    }
    else {
      let newToken = '';
      while (tokens[newToken] !== undefined
	     || newToken === '')
	newToken = crypto.randomBytes(32).toString('hex');

      tokens[newToken] = {
	messages: {
	  success: [],
	  error: []
	},
	connected: false
      };
      req.cookies.Token = newToken; // Edit received cookie is dirty, right ?
      res.cookie('Token', newToken);
    }

    res.renderView = function(view, data = {}) {
      tokens[req.cookies.Token].message = {
	success: [],
	error: []
      }
      data.connected = tokens[req.cookies.Token].connected;
      res.render(view, Object.assign(tokens[req.cookies.Token].messages, data));
    }
    next();
  }
}
