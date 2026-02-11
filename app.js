const express = require('express');
const UtilisateurController = require('./controllers/utilisateur.controller')

const app = express();

// pour utiliser ejs
app.set('view engine', 'ejs');

// pour lire les donnes du formulaires
app.use(express.urlencoded({ extended: true }))

// pour les fichiers statiques
app.use(express.static('public'))



app.get('/', (req, res) => {
    res.redirect('/utilisateurs')
})

app.get('/utilisateurs', UtilisateurController.listerUtilisateur)

app.get('/formulaire', UtilisateurController.afficherFormulaire)

app.post('/utilisateurs', UtilisateurController.ajouterUtilisateur)

app.listen(3000, () => {
    console.log('Serveur démarré')
})