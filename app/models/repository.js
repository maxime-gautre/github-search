'use strict';

+function () {

    /**
     * Librairie moment.js
     * @type moment
     */
    var moment = require('moment');

    /**
     * Objet Repository
     *
     * On vérifie d'abord si this est une instance de Repository. Si ce n'est pas le cas, on crée cette instance.
     * Si l'objet passé en paramètre n'est pas défini, on créé un objet vide.
     * On initialise chacune des propriétés de notre objet Repository avec l'objet passé en paramètre ou avec des
     * valeurs par défaut.
     *
     * @param object l'objet qui va servir à construire notre objet Repository
     * @returns Renvoie l'objet Repository créé
     * @constructor Constructeur de l'objet Repository
     */
    function Repository(object) {

        if (!(this instanceof Repository)) {
            return new Repository(object);
        }

        if (!object) {
            object = {};
        }

        this.id = object.id || -1;
        this.title = object.full_name || '';
        this.name = object.name || '';
        this.login = object.owner ? object.owner.login : '';
        this.html_url = object.html_url || '#';
        this.description = object.description || '';
        this.fork = object.fork || false;
        this.created_at = object.created_at ? moment(object.created_at) : undefined;
        this.updated_at = object.updated_at ? moment(object.updated_at) : undefined;
        this.size = (object.size / 1000).toFixed(3) || 0;
        this.language = object.language || '';
        this.forks = object.forks || 0;
        this.watchers = object.watchers || 0;

        return this;
    }

    module.exports = Repository;
}();


