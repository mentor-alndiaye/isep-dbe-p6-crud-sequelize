
const { Sequelize } = require('sequelize');

const db = new Sequelize('tache_db', 'alndiaye', 'alndiaye', {
    host: 'localhost',
    dialect: 'mysql'
});

db.authenticate()
    .then(() => console.log('Connexion à MySQL réussie'))
    .catch(err => console.log('Erreur de connexion', err))


module.exports = db;