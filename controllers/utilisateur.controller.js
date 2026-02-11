const Utilisateur = require('../models/utilisateurs.model')


const listerUtilisateur = async (req, res) => {
    const listUtilisateurs = await Utilisateur.findAll();

    // res.json(listUtilisateurs);
    res.render('list', { users: listUtilisateurs, message: req.query.message })
}

const afficherFormulaire = (req, res) => {
    res.render('form', { erreur: '' })
}

const ajouterUtilisateur = async (req, res) => {
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

}

module.exports = { listerUtilisateur, afficherFormulaire, ajouterUtilisateur }