'use strict';

var express = require('express'),
    router = express.Router(),
    async = require('async'),
    helpers = require('../helpers/helpers'),
    Repository = require('../models/repository'),
    Contributor = require('../models/contributor'),
    Commit = require('../models/commit'),
    HttpsGithubService = require('../services/httpsGithubService');


module.exports = function (app) {
    app.use('/', router);
};

/**
 * Fonction qui récupère les contributeurs
 * @param response tableau d'objet renvoyé par github
 * @returns Renvoie un tableau d'objet Contributor
 */
function getContributors(response) {
    return response.map(function (element) {
        return new Contributor(element);
    });
}


/**
 * Fonction qui récupère les commits
 * @param response tableau d'objet renvoyé par github
 * @returns Renvoie un tableau d'objet Commit
 */
function getCommits(response) {
    return response.map(function (element) {
        return new Commit(element);
    });
}

/**
 * Fonction qui regroupe les commit par utilisateurs
 * @param commits tableau d'objet Commit
 * @returns Renvoie un tableau d'objet trié par nombre de commit contenant l'auteur des commits,
 * son nombre de commits et une couleur au format héxadécimal
 */
function extractCommitByUser(commits) {

    var commitStats = {};

    commits.forEach(function (commit) {
        if (!commitStats.hasOwnProperty(commit.commit.author.name)) {
            commitStats[commit.commit.author.name] = {
                label: commit.commit.author.name,
                value: 1,
                color: "#" + helpers.getColorFromLogin(commit.commit.author.name)
            };
        } else {
            commitStats[commit.commit.author.name].value++;
        }
    });

    commitStats = Object.keys(commitStats).map(function (k) {
        return commitStats[k];
    }).sort(function (a, b) {
        return b.value - a.value;
    });
    return commitStats;
}

/**
 * Route vers l'analyse d'un projet
 * Utilise async pour exzcuter plusieurs appels à l'API Github en parallèlle.
 *
 * Récupération des informations générales d'un projet, des contributeurs et des commits.
 * Pour les commits, nous générons les statistiques sur l'impact des utilisateurs basé sur le nombre de commits
 */
router.get('/repos/:owner/:name', function (req, res, next) {

    var locals = {};
    var firstPath = '/repos/' + req.params.owner + '/' + req.params.name;
    var secondPath = firstPath + '/commits?per_page=100';
    var thirdPath = firstPath + '/contributors';

    async.parallel([function (callback) {
        new HttpsGithubService(firstPath).get(function (response) {
            locals.repository = new Repository(response);
            callback();
        }, function (_error, status) {
            var error = helpers.handleError(_error, status);
            callback(error);
        });
    }, function (callback) {

        new HttpsGithubService(secondPath).get(function (response) {
            locals.commits = getCommits(response);
            locals.commitStats = extractCommitByUser(locals.commits);
            callback();

        }, function (_error, status) {
            var error = helpers.handleError(_error, status);
            callback(error);
        });
    }, function (callback) {
        new HttpsGithubService(thirdPath).get(function (response) {
            locals.contributors = getContributors(response);
            callback();
        }, function (_error, status) {
            var error = helpers.handleError(_error, status);
            callback(error);
        });
    }], function (err) {
        if (err) return next(err);
        res.render('repo', {title: 'Analyse des données Github - Repository', data: locals});
    });
});


/**
 * Api : liste les infos d'un projet
 */
router.get('/api/repos/:owner/:name', function (req, res) {
    var path = '/repos/' + req.params.owner + '/' + req.params.name;

    new HttpsGithubService(path).get(function (response) {
        var repository = new Repository(response);
        res.status(200).json(repository);
    }, function (_error, status) {
        var error = helpers.handleError(_error, status);
        res.status(status).send(error);
    });
});

/**
 * Api : liste les commits
 */
router.get('/api/repos/:owner/:name/commits', function (req, res) {

    var path = '/repos/' + req.params.owner + '/' + req.params.name + '/commits';

    new HttpsGithubService(path).get(function (response) {
        var commits = getCommits(response);
        res.status(200).json(commits);
    }, function (_error, status) {
        var error = helpers.handleError(_error, status);
        res.status(status).send(error);
    });
});

/**
 * Api: liste les stats basé sur les commits
 */
router.get('/api/repos/:owner/:name/stats/commits', function (req, res) {

    var path = '/repos/' + req.params.owner + '/' + req.params.name + '/commits';

    new HttpsGithubService(path).get(function (response) {

        var commits = getCommits(response);
        var commitStats = extractCommitByUser(commits);
        res.status(200).json(commitStats);

    }, function (_error, status) {
        var error = helpers.handleError(_error, status);
        res.status(status).send(error);
    });
});


/**
 * Api : liste les contribteurs
 */
router.get('/api/repos/:owner/:name/contributors', function (req, res) {

    var path = '/repos/' + req.params.owner + '/' + req.params.name + '/contributors';

    new HttpsGithubService(path).get(function (response) {
        var contributors = getContributors(response);
        res.status(200).json(contributors);
    }, function (_error, status) {
        var error = helpers.handleError(_error, status);
        res.status(status).send(error);
    });
});