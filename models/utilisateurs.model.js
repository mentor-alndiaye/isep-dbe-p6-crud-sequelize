const db = require('../config/db')
const { DataTypes } = require('sequelize')

// modele utilisateur
const Utilisateur = db.define('Utilisateur', {
    // id: {
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true
    // },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false // obligatoire
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    mot_de_passe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telephone: {
        type: DataTypes.STRING
    }
});
// Synchronisation du modèle avec la base de données
// ATTENTION : { force: true } supprime et recrée la table à chaque démarrage
// À utiliser UNIQUEMENT en développement !
db.sync({ alter: true })
    .then(() => console.log("Base de donnes synchronisee"))
    .catch(err => console.log('Erreur de synchronisation', err))

module.exports = Utilisateur