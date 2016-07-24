#!/usr/bin/env node

let apiRequest = require('./api_request');
let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let app = express();
let Token = require('./token');
global.config = require(process.env.CONFIG_FILE || './config.json');
global.token = new Token;

app.set('view engine', 'pug');

app.listen(process.env.PORT || config.port);
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('./public'));
app.use(function(req, res, next) {
  res.viewData = {
    errors: [],
    notices: [],
    connected: token.isAuthenticated(req)
  };
  res.renderView = function(view, data) {
    res.render(view, Object.assign(res.viewData, data));
  };
  next();
});

app.post('/register', function(req, res) {
  apiRequest(req, res, 'post', '/register', function(e, r, b) {
    if (r.statusCode === 201) {
      res.viewData.notices.push('You successfully logged in');
      apiRequest(req, res, 'get', '/movies/last/15', function(e, r, b) {
	if (r.statusCode === 200) {
	  res.renderView('home', {movies: JSON.parse(b)});
	}
      });
    }
    else
      res.renderView('register');
  });
});

app.post('/login', function(req, res) {
  apiRequest(req, res, 'post', '/login', function(e, r, b) {
    if (r.statusCode === 200) {
      token.authenticate(JSON.parse(b).token, req.body.login);
      res.cookie('Token', JSON.parse(b).token);
      res.viewData.connected = true;
      res.viewData.notices.push('You successfully logged in');
      apiRequest(req, res, 'get', '/movies/last/15', function(e, r, b) {
	if (r.statusCode === 200) {
	  res.renderView('home', {movies: JSON.parse(b)});
	}
      });
    }
    else
      res.renderView('register');
  });
});

app.get(['/register', '/login'], function(req, res) {
  res.renderView('register');
});

app.get('/', function(req, res) {
  apiRequest(req, res, 'get', '/movies/last/15', function(e, r, b) {
    if (r.statusCode === 200) {
      res.renderView('home', {movies: JSON.parse(b)});
    }
  });
});
