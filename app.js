

var express = require('express'),
  config = require('./config/config'),
  helpers = require('./app/helpers/helpers');

var app = express();

require('./config/express')(app, config);

app.locals.formatDate = helpers.formatDate;

app.listen(config.port);

