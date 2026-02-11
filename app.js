const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

// pour utiliser ejs
app.set('view engine', 'ejs');

// pour lire les donnes du formulaires
app.use(express.urlencoded({ extended: true }))

// pour les fichiers statiques
app.use(express.static('public'))

const db = new Sequelize('tache_db', 'alndiaye', 'alndiaye', {
    host: 'localhost',
    dialect: 'mysql'
});

db.authenticate()
    .then(() => console.log('Connexion à MySQL réussie'))
    .catch(err => console.log('Erreur de connexion', err))

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


app.get('/utilisateurs', async (req, res) => {
    const listUtilisateurs = await Utilisateur.findAll();

    // res.json(listUtilisateurs);
    res.render('list', { users: listUtilisateurs, message: req.query.message })
})

app.get('/formulaire', (req, res) => {
    res.render('form', {erreur: ''})
})

app.post('/utilisateurs', async (req, res) => {
    try {
        const { prenom, nom, email, telephone } = req.body;
        if (!prenom || !nom || !email) {
            return res.render('form', { erreur: 'prenom, nom et email sont obligatoires' })
        }

        // verifier depuis la base l unicite de l email
        await Utilisateur.create({
            prenom: prenom,
            nom: nom,
            email: email,
            telephone: telephone,
        })

        res.redirect('/utilisateurs?message=creation')
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.render('form', { erreur: 'L email doit etre unique' })
        } else {
            return res.render('form', { erreur: 'Erreur lors de la création' })
        }
    }

})

app.listen(3000, () => {
    console.log('Serveur démarré')
})