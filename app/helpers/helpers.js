

'use strict';

/**
 * Fonction qui formate la date passée en paramètre en français et au format passé dans le second paramètre.
 *
 * @param date date à formater
 * @param format format souhaité
 * @returns Renvoie la nouvelle date
 */
var buildDate = function(date, format) {
    return date.locale('fr').format(format);
};

/**
 * Fonction qui retourne si une requête est une requête Ajax ou non.
 *
 * @param req requête à vérifier
 * @returns Vrai si la requête est une requête Ajax, Faux sinon.
 */
var isAjax = function(req){
    return req.headers['x-requested-with'] && req.headers['x-requested-with'] == 'XMLHttpRequest';
};

/**
 * Fonction qui créé une couleur au format hexadécimal en fonction du login du contributeur passé en paramètre
 * @param login login du contributeur
 * @returns Renvoie une chaîne composée de 6 caractères correspondant à une couleur au format héxadécimal
 */
var getColorFromLogin = function(login) {

    function hashCode(str) { // java String#hashCode
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    function intToARGB(i){
        var h = ((i>>24)&0xFF).toString(16) +
            ((i>>16)&0xFF).toString(16) +
            ((i>>8)&0xFF).toString(16) +
            (i&0xFF).toString(16);
        return h.substring(0, 6);
    }

    return intToARGB(hashCode(login));
};

var handleError = function(_error, status) {

    var error = new Error();
    error.status = status;
    error.message = _error.message || 'Une erreur s\'est produite';
    return error;
};

module.exports = {
    formatDate: buildDate,
    isAjax: isAjax,
    getColorFromLogin: getColorFromLogin,
    handleError: handleError
};


