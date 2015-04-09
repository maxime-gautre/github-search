# Analyse des données - Github API V3

## Objectif

L'objectif de cette application est d'utiliser l'API Github pour permettre à l'utilisateur :

* rechercher un repository
* accéder à un repository
* voir les contributeurs d'un repository
* voir la contribution de chaque utilisateur sur les 100 derniers commits
* voir l'historique des 100 derniers commits
* sauvegarder un repository pour y avoir accès plus rapidement

## Outils et technologies

L'application a été réalisée avec le framework ExpressJS (Node JS).
Le moteur de templating utilisé est EJS. Pour la présentation, LESS a été utilisé ainsi que le framework de présentation, Materialize.
Pour afficher les différents graphiques, la librairie ChartJS a été retenue. Le stockage des projets
se fait côté client en utilisant la base de données IndexedDB.

La version de Github utilisée est la version 3.

## Installation

Ce projet nécessite l'installation de Node JS.
Il faut avoir installer grunt et bower de manière globale.
Après avoir récupéré les sources du projet, on se place à la racine du projet, et on exécute les commandes suivantes :

- npm install
- bower install

## Lancement

- dev
    - grunt serve
    - localhost:3000/

- dist
    - grunt build
    - node dist/app.js
    - localhost:3000/

