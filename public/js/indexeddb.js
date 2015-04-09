'use strict';

var indexedDBHelper = function () {
    var db = null;
    var lastIndex = 0;

    var open = function () {
        var version = 1;

        var promise = new Promise(function (resolve, reject) {
            //Opening the DB
            var request = indexedDB.open('repositories_db', version);

            //Handling onupgradeneeded
            //Will be called if the database is new or the version is modified
            request.onupgradeneeded = function (e) {
                db = e.target.result;

                e.target.transaction.onerror = indexedDB.onerror;

                //Deleting DB if already exists
                if (db.objectStoreNames.contains('repositories')) {
                    db.deleteObjectStore('repositories');
                }

                //Creating a new DB store with a paecified key property
                var store = db.createObjectStore('repositories', {keyPath: 'id'});
            };

            //If opening DB succeeds
            request.onsuccess = function (e) {
                console.log('database open');
                db = e.target.result;
                resolve();
            };

            //If DB couldn't be opened for some reason
            request.onerror = function (e) {
                reject('Couldn\'t open DB');
            };
        });
        return promise;
    };

    var addRepo = function (repo) {
        //Creating a transaction object to perform read-write operations
        var trans = db.transaction(['repositories'], 'readwrite');
        var store = trans.objectStore('repositories');

        //Wrapping logic inside a promise
        var promise = new Promise(function (resolve, reject) {
            //Sending a request to add an item
            var request = store.add(repo);

            //success callback
            request.onsuccess = function (e) {
                resolve();
            };

            //error callback
            request.onerror = function (e) {
                reject('Couldn\'t add the passed item ' + e.value);
            };
        });

        return promise;
    };

    var getRepo = function (id) {
        var transaction = db.transaction(['repositories'], 'readonly');
        var store = transaction.objectStore('repositories');

        var promise = new Promise(function (resolve, reject) {

            var request = store.get(id);

            request.onsuccess = function (e) {

                var result = e.target.result;
                resolve(result);
            };

            request.onerror = function (e) {
                reject('Couldn\'t read the item with id : '+id);
            };
        });

        return promise;
    };

    var getAllRepos = function () {
        var todosArr = [];

        //Creating a transaction object to perform Read operations
        var trans = db.transaction(['repositories'], 'readonly');

        //Getting a reference of the todo store
        var store = trans.objectStore('repositories');

        //Wrapping all the logic inside a promise
        var promise = new Promise(function (resolve, reject) {
            //Opening a cursor to fetch items from lower bound in the DB
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = store.openCursor(keyRange);

            //success callback
            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                //Resolving the promise with todo items when the result id empty
                if (result === null || result === undefined) {
                    resolve(todosArr);
                }
                //Pushing result into the todo list
                else {
                    todosArr.push(result.value);
                    if (result.value.id > lastIndex) {
                        lastIndex = result.value.id;
                    }
                    result.continue();
                }
            };

            //Error callback
            cursorRequest.onerror = function (e) {
                reject('Couldn\'t fetch items from the DB');
            };
        });
        return promise;
    };

    var deleteRepo = function (id) {

        var promise = new Promise(function (resolve, reject) {
            var trans = db.transaction(['repositories'], 'readwrite');
            var store = trans.objectStore('repositories');
            var request = store.delete(id);

            request.onsuccess = function (e) {
                resolve();
            };

            request.onerror = function (e) {
                reject('Couldn\'t delete the item with id '+id);
            };
        });
        return promise;
    };

    return {
        open: open,
        addRepo: addRepo,
        getRepo: getRepo,
        getAllRepos: getAllRepos,
        deleteRepo: deleteRepo
    };

}();

var uiActions = function (indexedDBHelper) {
    function init() {
        indexedDBHelper.open().then(function () {
            refreshList();
            var id = $('#repoId').val();
            if(id) {
                indexedDBHelper.getRepo(+id).then(function(repo){
                    if(repo) {
                        $('button#deleteRepo').show();
                    } else {
                        $('button#saveRepo').show();
                    }
                }, function(err){
                    console.log(err);
                });
            }
        }, function (err) {
            console.log(err);
        });
    }

    var addRepo = function () {

        var repo = {

            id: +$('#repoId').val(),
            login: $('#repoLogin').text(),
            name: $('#repoName').text(),
            language: $('#repoLanguage').text()
        };

        indexedDBHelper.addRepo(repo).then(function () {
            refreshList();
            toast('Le repository a été ajouté', 3000);
            $('button#saveRepo').hide();
            $('button#deleteRepo').show();
        }, function (err) {
            console.log(err);
        });
        return false;
    };

    var refreshList = function () {
        indexedDBHelper.getAllRepos().then(function (repos) {
            refreshTodoList(repos);
        }, function (err) {
            console.log(err);
        });
    };

    var deleteRepo = function (_id) {

        var id = _id || $('#repoId').val();
        indexedDBHelper.deleteRepo(+id).then(function () {
            refreshList();
            toast('Le repository a été supprimé', 3000);
            $('button#saveRepo').show();
            $('button#deleteRepo').hide();

        }, function (err) {
            console.log(err);
        });
    };

    function refreshTodoList(repos) {


        if (repos && repos.length !== 0) {
            var list = repos.map(function (element) {
                return '<li>' +
                    '<a class="bookmarks-link" href="/repos/' + element.login + '/' + element.name + '">'
                    + element.name + ' - ' + element.login + '</a><span class="bookmarks-right"><i class="fa fa-code"></i>'+
                    element.language +
                    '<a class="btn btn-flat btn-floating waves-effect waves-light icon-hover" onclick="uiActions.deleteRepo('+element.id+')">' +
                    '<i class="mdi-action-delete red-text text-lighten-1"></i></a>' +
                    '</span></li>';
            }).join('');

            $('#reposList').html('<ul>' + list + '</ul>');
        } else {

            $('#reposList').html('<ul><li>Aucun projet sauvegardé</li></ul>');
        }
    }

    init();

    return {
        addRepo: addRepo,
        refreshList: refreshList,
        deleteRepo: deleteRepo
    };

}(indexedDBHelper);
