
'use strict';

+function(){
    /**
     * Objet Contributor
     *
     * On vérifie d'abord si this est une instance de Contributor. Si ce n'est pas le cas, on crée cette instance.
     * Si l'objet passé en paramètre n'est pas défini, on créé un objet vide.
     * On initialise chacune des propriétés de notre objet Contributor avec l'objet passé en paramètre ou avec des
     * valeurs par défaut.
     *
     * @param object l'objet qui va servir à construire notre objet Contributor
     * @returns Renvoie l'objet Contributor créé
     * @constructor Constructeur de l'objet Contributor
     */
    function Contributor(object) {

        if(!(this instanceof Contributor)) {
            return new Contributor(object);
        }

        if(!object) {
            object = {};
        }

        this.login = object.login || '';
        this.avatar = object.avatar_url || '';
        this.url = object.html_url || '';
        this.type = object.type || '';
        this.contributions = object.contributions || 0;

        return this;
    }

    module.exports = Contributor;
}();