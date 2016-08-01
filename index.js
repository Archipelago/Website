#!/usr/bin/env node

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
app.use(token.mid);

require('./routes/user.js')(app);
require('./routes/movie.js')(app);
require('./routes/misc.js')(app);
