'use strict';

(function () {

    /**
     * Librairie Https pour faire des appels HTTPS.
     * Permet de consommer l'api Github
     * @type HTTPS
     */
    var https = require('https');

    /**
     * Service qui permet de contacter l'api Github en lui passant l'URL souhaitée.
     * Le service est composé de deux éléments
     *  - l'url correspondant à l'url de l'api Github
     *  - la fonction get qui va contacter le service REST de Github.
     *    La fonction créé les options nécessaires pour appeler l'API Github. Si l'appel est un succès,
     *    on parse le résultat au format JSON et on exécute la fonction de callback de succès passée en paramètre. Sinon
     *    on exécute notre fonction de callback d'error passée en paramètre.
     *
     * @param url url souhaitée
     * @constructor Constructeur du service
     */
    function HttpsGithubService(url) {

        this.url = url;
        this.get = function (successFunct, errorFunct) {

            var optionsGet = getOptions(this.url);
            var reqGet = https.request(optionsGet, function (res) {
                var body = '';
                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function () {
                    if (res.statusCode === 200) {
                        successFunct(JSON.parse(body), res.headers);
                    } else {
                        errorFunct(JSON.parse(body), res.statusCode);
                    }
                });
            });
            reqGet.end();
            reqGet.on('error', function (e) {
                errorFunct(e, 404);
            });

        };

        /**
         * Fonction qui créé les options nécéssaires
         *
         * @param url url souhaitée
         * @returns Renvoie un objet contenant : host: string, port: number, path: url passée en paramètre, method: string, headers: {User-Agent: string}}
         */
        function getOptions(url) {
            return {
                host: 'api.github.com',
                port: 443,
                path: url,
                method: 'GET',
                headers: {
                    'User-Agent': 'github-search-app'
                }
            };
        }
    }

    module.exports = HttpsGithubService;
})();