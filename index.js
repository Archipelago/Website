#!/usr/bin/env node

let request = require('request');
let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let app = express();
global.config = require(process.env.CONFIG_FILE || './config.json');

app.set('view engine', 'pug');

app.listen(process.env.PORT || config.port);
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('./public'));

app.post('/register', function(req, res) {
  request.post({url: 'http://localhost:8080/register',
		form: JSON.stringify(req.body)},
	       function(e, r, b) {
		 if (r.statusCode === 201)
		   res.render('home', {notice: 'Account successfully created'});
		 else {
		   res.render('register', {error: JSON.parse(b).message});
		 }
	       });
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.get('/', function(req, res) {
  res.render('home');
});
