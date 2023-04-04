import {pool} from '../config/dataBase.js'
import bcrypt from 'bcrypt';
import {inputLengthUp, inputLengthDown} from './config_back/inputLengthBack.js'

const host = "http://leosarlange.sites.3wa.io"
const port = 9300
const BASE_URL = `${host}:${port}`

const registerSUBController = (req, res) => {
    
    const validMdp = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;
    let register = 'INSERT INTO Users (nom, prenom, email, mot_de_passe, statut_ID) VALUES (?, ?, ?, ?, ?)'
    const saltRounds = 10;
    
    if(inputLengthUp(req.body.nom) && inputLengthUp(req.body.prenom) && inputLengthUp(req.body.email) && inputLengthUp(req.body.mdp) && inputLengthDown(req.body.nom) && inputLengthDown(req.body.prenom) && inputLengthDown(req.body.email) && inputLengthDown(req.body.mdp)){
        
        if (req.body.mdp.match(validMdp)) {
        
            if (req.body.mdp === req.body.verifMDP) {
                
                bcrypt.hash(req.body.mdp, saltRounds, (err, hash) => {
                    if (err) throw err
                    
                    pool.query(register, [req.body.nom, req.body.prenom, req.body.email, hash, 1],  (error, result) =>{
                        if (error) throw error
                        res.json({response:true, message:'Vous etes inscrit!!'})
                    })
                })
            } else {
                res.json({response:false, statutErr:1, message:'Oups! Il semblerait que les mots de passe ne soient pas identiques'})
            }
        } else {
            res.json({response:false, statutErr:2, message:'Oups! Il semblerait que que vous n\'ayez pas mis au minimum 7 caractères avec 1 lettre majuscule, 1 lettre minuscule et 1 chiffre sans espace.'})
        }
    } else {
            res.json({response:false, statutErr:3, message:'Oups! Il semblerait qu\'il y ai trop de caractères dans le champs'})
    }
}

export default registerSUBController