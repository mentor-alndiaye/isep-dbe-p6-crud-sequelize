const bcrypt = require('bcrypt')
const Utilisateur = require('../models/utilisateurs.model')

// afficher form
const afficherFormulaireInscription = (req, res) => {
    res.render('inscription', { erreur: '' })
}


const inscription = async (req, res) => {
    // verifier si tous les champs sont saisis
    // verfiier si les deux mot de passse correspondent
    // verifier si l'email n existe
    // hacher le mot de passe
    // sauvegarder le user

    try {
        const { prenom, nom, email, telephone, mdp, conf_mdp } = req.body;
        if (!prenom || !nom || !email || !mdp || !conf_mdp) {
            return res.render('form', { erreur: 'prenom, nom et email, conf_mdp sont obligatoires' })
        }

        if (mdp != conf_mdp) {
            return res.render('form', { erreur: 'Les deux mots de passe sont differents' })
        }

        // verifier depuis la base l unicite de l email

        const motPasseHashe = await bcrypt.hash(mdp, 10)
        await Utilisateur.create({
            prenom: prenom,
            nom: nom,
            email: email,
            telephone: telephone,
            mot_de_passe: motPasseHashe
        })

        res.redirect('/connexion?message=inscription')
    } catch (error) {
        console.log(error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.render('inscription', { erreur: 'L email doit etre unique' })
        } else {
            return res.render('inscription', { erreur: 'Erreur lors de l inscription' })
        }
    }

}

const afficherFormulaireConnexion = (req, res) => {
    res.render('connexion', { erreur: '' })

}

const connexion = async (req, res) => {
    // recuperr les infos
    // verifier si login et mdp donnes
    // verfier dans la base
    // redirige vers list user
    try {
        const { email, mdp } = req.body

                if ( !email || !mdp) {
            return res.render('form', { erreur: 'email, conf_mdp sont obligatoires' })
        }
        // verfier dans la base

        const utilisateur = await Utilisateur.findOne({ where: { email } });
        if (!utilisateur) {
            res.render('connexion', { erreur: 'Login ou mot de passe incorrects' })
        }

        console.log(mdp);
        
        console.log(utilisateur);
        
        const estValide = await bcrypt.compare(mdp, utilisateur.mot_de_passe)

        if (!estValide) {
            res.render('connexion', { erreur: 'Login ou mot de passe incorrects' })
        }

        req.session.idUtilisateur = utilisateur.email;
        req.session.nomComplet = utilisateur.prenom + ' ' + utilisateur.nom

        res.redirect('/utilisateurs')
    } catch (error) {
        console.log(error);

        res.render('connexion', { erreur: 'Erreur lors de la connexion' })
    }
}

const deconnexion = (req, res) => {

}


module.exports = { afficherFormulaireInscription, afficherFormulaireConnexion, inscription, connexion, deconnexion }