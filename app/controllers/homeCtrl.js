

var express = require('express'),
    router = express.Router();

module.exports = function (app) {
    app.use('/', router);
};

/**
 * Route vers l'accueil
 */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Analyse des données Github - Search API'
    });
});

/**
 * Route vers l'API
 */
router.get('/doc/api', function (req, res) {
    res.render('api', {
        title: 'Analyse des données Github - Documentation API'
    });
});

