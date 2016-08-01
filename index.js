#!/usr/bin/env node

let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let app = express();
let Token = require('./token');
let apiRequest = require('./api_request');
global.config = require(process.env.CONFIG_FILE || './config.json');
global.token = new Token;

app.set('view engine', 'pug');

app.listen(process.env.PORT || config.port);
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('./public'));
app.use(token.mid);
app.use(function(req, res, next) {
  res.renderDefaultPage = function(req, res) {
    apiRequest(req, res, 'get', '/movies/last/15', function(e, r, b) {
      if (r.statusCode === 200) {
	res.renderView('home', {movies: JSON.parse(b)});
      }
    });
  };
  next();
});


require('./routes/user.js')(app);
require('./routes/movie.js')(app);
require('./routes/misc.js')(app);

app.use(function(req, res, next) {
  res.statusCode = 404;
  token.setMessage(req, 'error', 'Page ' + req._parsedOriginalUrl.path + ' does not exist');
  res.renderDefaultPage(req, res);
});
