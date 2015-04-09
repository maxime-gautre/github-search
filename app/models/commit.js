'use strict';

+function () {

    /**
     * Librairie moment.js
     * @type moment
     */
    var moment = require('moment');

    /**
     * Objet Commit
     *
     * On vérifie d'abord si this est une instance de Commit. Si ce n'est pas le cas, on crée cette instance.
     * Si l'objet passé en paramètre n'est pas défini, on créé un objet vide.
     * On initialise chacune des propriétés de notre objet Commit avec l'objet passé en paramètre ou avec des
     * valeurs par défaut.
     *
     * @param object l'objet qui va servir à construire notre objet Commit
     * @returns Renvoie l'objet Commit créé
     * @constructor Constructeur de l'objet Commit
     */
    function Commit(object) {

        if (!(this instanceof Commit)) {
            return new Commit(object);
        }

        if (!object) {
            object = {};
        }

        this.login = object.committer && object.committer.login || '';
        this.avatar = object.committer && object.committer.avatar_url || '';
        this.url = object.html_url || '';
        this.sha = object.sha || '';
        this.commit = object.commit || {};
        this.date = object.commit && object.commit.committer ? moment(object.commit.committer.date) : undefined;

        return this;
    }

    module.exports = Commit;
}();