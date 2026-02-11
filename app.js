const express = require('express');
const UtilisateurController = require('./controllers/utilisateur.controller')
const connexionController = require('./controllers/connexion.controller');
const session = require('express-session');

const app = express();

// pour utiliser ejs
app.set('view engine', 'ejs');

// pour lire les donnes du formulaires
app.use(express.urlencoded({ extended: true }))

// pour les fichiers statiques
app.use(express.static('public'))

app.use(session({
    secret: 'mon-secret-dbe',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 24 * 60 * 60 * 1000}
}))


function protegerRoute(req, res, next) {
    if (req.session.idUtilisateur) {
        return next()
    }

    res.redirect('/connexion')
}

app.get('/inscription', connexionController.afficherFormulaireInscription)
app.post('/inscription', connexionController.inscription);

app.get('/connexion', connexionController.afficherFormulaireConnexion)
app.post('/connexion', connexionController.connexion)


app.get('/', (req, res) => {
    res.redirect('/utilisateurs')
})

app.get('/utilisateurs', protegerRoute, UtilisateurController.listerUtilisateur)

app.get('/formulaire', protegerRoute, UtilisateurController.afficherFormulaire)

app.post('/utilisateurs', UtilisateurController.ajouterUtilisateur)

app.listen(3000, () => {
    console.log('Serveur démarré')
})