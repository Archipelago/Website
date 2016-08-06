let crypto = require('crypto');
let apiRequest = require('./api_request');

module.exports = function() {
  // token: login, remote, messages, connected
  let tokens = {};

  this.authenticate = function(req, token, login) {
    tokens[req.Token].remote = token;
    tokens[req.Token].login = login.trim();
    tokens[req.Token].connected = true;
    apiRequest(req, {}, 'get', '/user', function(e, r, b) {
      tokens[req.Token].permissions = b.permissions;
    });
  }

  this.logout = function(req) {
    if (this.isAuthenticated(req)) {
      tokens[req.Token].connected = false;
      tokens[req.Token].permissions = [];
      delete tokens[req.Token].remote;
      delete tokens[req.Token].login;
    }
  }

  this.isAuthenticated = function(req) {
    return tokens[req.Token].connected;
  }

  this.getPermissions = function(req) {
    if (!this.isAuthenticated(req))
      return [];
    else
      return tokens[req.Token].permissions;
  }

  this.getRemoteToken = function(req) {
    return tokens[req.Token].remote;
  }

  this.getLastPage = function(req) {
    return tokens[req.Token].lastPage;
  }

  this.checkAuthentication = function(req, res, next) {
    if (tokens[req.Token] === undefined
	|| tokens[req.Token].connected !== true) {
      res.statusCode = 401;
      this.setMessage(req, 'error', 'You need to be logged in to access this page');
      res.redirect('/register');
    }
    else
      next(req, res);
  }

  this.setMessage = function(req, type, content) {
    tokens[req.Token].messages[type].push(content);
  }

  this.mid = function(req, res, next) {
    if (req.cookies.Token
	&& tokens[req.cookies.Token] !== undefined) {
      req.Token = req.cookies.Token;
      if (tokens[req.Token].connected === true)
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
	lastPage: '/',
	connected: false
      };
      req.Token = newToken;
      res.cookie('Token', newToken);
    }

    res.renderView = function(view, data = {}) {
      let msgs = tokens[req.Token].messages;
      tokens[req.Token].messages = {
	success: [],
	error: []
      };
      tokens[req.Token].lastPage = req.originalUrl;
      data.connected = tokens[req.Token].connected;
      res.render(view, Object.assign(msgs, data));
    }
    next();
  }
}
