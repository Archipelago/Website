#!/usr/bin/env node

let express = require('express');
let i18n = require('i18n');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let app = express();
let Token = require('./token');
let apiRequest = require('./api_request');
global.config = require(process.env.CONFIG_FILE || './config.json');
global.token = new Token;

app.set('view engine', 'pug');
app.set('x-powered-by', false);
app.locals.__ = i18n.__;

i18n.configure({directory: __dirname + '/locales',
		defaultLocale: config.defaultLocale || 'en',
		updateFiles: false});

app.listen(process.env.PORT || config.port);
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('./public'));
app.use(token.mid);
app.use(i18n.init);
app.use(function(req, res, next) {
  req.setLocale(config.defaultLocale);
  app.locals.locale = i18n.getLocale();
  res.renderDefaultPage = function(req, res) {
    apiRequest(req, res, 'get', '/movies/last/15', function(e, r, b) {
      if (r.statusCode === 200) {
	res.renderView('home', {movies: b});
      }
      else
	res.renderView('home', {movies: []});
    });
  };
  next();
});

require('./routes')(app);

app.use(function(req, res, next) {
  res.statusCode = 404;
  token.setMessage(req, 'error', 'Page ' + req.originalUrl + ' does not exist');
  res.renderDefaultPage(req, res);
});
