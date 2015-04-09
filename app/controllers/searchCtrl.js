'use strict';

var express = require('express'),
    router = express.Router(),
    helpers = require('../helpers/helpers'),
    Repository = require('../models/repository'),
    parseLinks = require('parse-links'),
    HttpsGithubService = require('../services/httpsGithubService');


module.exports = function (app) {
    app.use('/', router);
};


/**
 * Fonction qui s'occupe de l'extraction des paramètres de la requête
 * @param _paramQuery: requête
 * @param path: base du chemin
 * @returns string l'URL contenant le chemin plus les paramètres
 */
function computeQuery(_paramQuery, path) {

    if (!_paramQuery.search) return '';

    var query = 'q=' + _paramQuery.search;

    var inQuery = _paramQuery.project ? _paramQuery.project instanceof Array ? ' in:' + _paramQuery.project.join(',') :
    ' in:' + _paramQuery.project : '';
    var language = _paramQuery.language ? ' language:' + _paramQuery.language : '';
    var sizeValue = _paramQuery.size ? _paramQuery.size * 1000 : '';
    var limitSizeValue = _paramQuery.limitSize ? _paramQuery.limitSize * 1000 : '';
    var size = extractInterval(sizeValue, _paramQuery.signSize, 'size', limitSizeValue);
    var stars = extractInterval(_paramQuery.stars, _paramQuery.signStars, 'stars', _paramQuery.limitStars);
    var forks = extractInterval(_paramQuery.forks, _paramQuery.signForks, 'forks', _paramQuery.limitForks);
    var fork = extractFork(_paramQuery.includeForks);
    var date = extractDate(_paramQuery.date_submit, _paramQuery.dateLabel, _paramQuery.periodDate);

    var sort = _paramQuery.sort ? '&sort=' + _paramQuery.sort : '';
    var order = _paramQuery.order ? '&order=' + _paramQuery.order : '';
    var page = _paramQuery.page ? '&page=' + _paramQuery.page : '';
    var perPage = _paramQuery.per_page ? '&per_page=' + _paramQuery.per_page : '';

    return path + query + inQuery + language + size + stars + forks + fork + date + sort + order + page + perPage;
}

function extractInterval(qualifier, group, qualifierLabel, field) {
    if (qualifier) {
        var sign = group;
        if (sign === 'equal') {
            return ' ' + qualifierLabel + ':' + qualifier;
        } else if (sign === 'less') {
            return ' ' + qualifierLabel + ':<' + qualifier;
        } else if (sign === 'greater') {
            return ' ' + qualifierLabel + ':>=' + qualifier;
        } else if (sign === 'limit' && field && qualifier < field) {
            return ' ' + qualifierLabel + ':' + qualifier + '..' + field;
        } else {
            return '';
        }
    } else {
        return '';
    }
}

function extractFork(qualifier) {
    if (qualifier === 'true') {
        return ' fork:true';
    } else if (qualifier === 'only') {
        return ' fork:only';
    } else {
        return '';
    }
}

function extractDate(date, dateField, radioDate) {
    if (date) {
        var sign = radioDate;
        if (sign === 'before') {
            return ' ' + dateField + ':<' + date;
        } else if (sign === 'after') {
            return ' ' + dateField + ':>=' + date;
        } else {
            return '';
        }
    } else {
        return '';
    }
}

/**
 * Fonction qui créé la requête
 *
 * Si la requête est une requête ajax, on renvoie cette URL.
 * Sinon, on appelle la fonction computeQuery qui va extraire chacun des paramètres de la requête et on encode l'URL
 * créée.
 *
 * @param req requête
 * @returns {string} URL
 */
function createQuery(req) {

    var path = '/search/repositories?';
    var ajaXPath;

    if (helpers.isAjax(req)) {
        ajaXPath = path + req._parsedUrl.query;
        if (!req.query.per_page) {
            return ajaXPath + '&per_page=10';
        }
        return ajaXPath;
    } else {
        return encodeURI(computeQuery(req.query, path));
    }
}

/**
 * Fonction qui liste les repositories
 * @param response objet contenant les repositories
 * @returns {count: *, items: *} un objet contentant les repositories
 */
function extractData(response) {
    var repositories = response.items.map(function (el) {
        return new Repository(el);
    });

    return {
        count: response.total_count,
        items: repositories
    };
}


/**
 * Route de recherche
 * Construit l'URL en fonction de la requête et appelle le service HttpGithub pour l'appel vers l'API.
 */
router.get('/search', function (req, res, next) {


    var path = createQuery(req);

    if (path === '') {
        return next({
            'status': 400,
            'message': 'La requête contient une erreur. Le paramètre search est requis.'
        });
    }

    new HttpsGithubService(path).get(function (response, headers) {
        var data = extractData(response);

        if (headers.link) {
            var links = parseLinks(headers.link);
            if (links && links.next) {
                data.next = links.next.split('?')[1];
            }
        }

        if (helpers.isAjax(req)) {
            res.render('repos', {
                data: data,
                page: req.query.page || 1
            });
        } else {
            res.render('search', {
                title: 'Analyse des données Github - Repositories',
                data: data,
                page: req.query.page || 1
            });
        }
    }, function (_error, status) {
        var error = helpers.handleError(_error, status);
        next(error);
    });
});

/**
 * Api : recherche des repositories
 */
router.get('/api/search', function (req, res) {

    var path = encodeURI(computeQuery(req.query, '/search/repositories?'));
    if (path === '') {
        return res.status(400).send({
            'status': 400,
            'message': 'La requête contient une erreur. Le paramètre search est requis.'
        });
    }

    new HttpsGithubService(path).get(function (response) {
        var data = extractData(response);
        res.status(200).json(data);

    }, function (_error, status) {
        var error = helpers.handleError(_error, status);
        res.status(status).send(error);
    });
});



