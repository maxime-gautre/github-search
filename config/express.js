var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');

module.exports = function (app, config) {
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'ejs');

    var env = process.env.NODE_ENV || 'development';
    app.locals.ENV = env;
    app.locals.ENV_DEVELOPMENT = env == 'development';

    // app.use(favicon(config.root + '/public/img/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(compress());
    app.use(express.static(config.root + '/public'));
    app.use(methodOverride());

    var controllers = glob.sync(config.root + '/app/controllers/*.js');
    controllers.forEach(function (controller) {
        require(controller)(app);
    });

    app.use(function (req, res, next) {
        var err = new Error('OOPS! - Could not Find it');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {

            res.status(err.status || 500);
            if (err.status === 404) {

                res.render('404', {
                    message: err.message,
                    error: err,
                    title: 'error'
                });
            } else {
                res.render('500', {
                    message: err.message,
                    error: err,
                    title: 'error'
                });
            }
        });
    }

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        if (err.status === 404) {

            res.render('404', {
                message: err.message,
                error: err,
                title: 'error'
            });
        } else {
            res.render('500', {
                message: err.message,
                error: err,
                title: 'error'
            });
        }
    });
};
