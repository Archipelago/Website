#!/usr/bin/env node

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

app.get('/', function(req, res) {
  res.render('home');
});
