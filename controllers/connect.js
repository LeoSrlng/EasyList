import {asyncQuery, pool} from '../config/dataBase.js'
import bcrypt from 'bcrypt';
import {inputLengthUp, inputLengthDown} from './config_back/inputLengthBack.js'
import { generateToken } from "./token.js"

const connectSUBController = (req, res) => {
    
    let hashMDP = "SELECT id, prenom, mot_de_passe, statut_ID FROM Users WHERE email = ?"
    
    if(inputLengthUp(req.body.email) && inputLengthUp(req.body.mdp)){
        pool.query(hashMDP,[req.body.email], (err, resultmail) => {
            if (err) throw err
            
            if(resultmail[0]){
                bcrypt.compare(req.body.mdp,resultmail[0].mot_de_passe, async (err, result) => {
                    if (err) throw err
                    if(result){
                        const admin = resultmail[0].statut_ID === 2
                        const infoUser = {id:resultmail[0].id, prenom:resultmail[0].prenom}
                        const userData = {
                            infoUser,
                            user:true,
                            admin
                        }
                        const token = await generateToken(userData)
                        res.json({response:true, admin, message:'Vous etes connecté!!', token, infoUser})
                    } else {
                        res.json({response:false, message:'Le mot de passe ou l\'email n\'est pas correcte'})
                    }
                })
            } else {
                res.json({response:false, message:'Le mot de passe ou l\'email n\'est pas correcte'})
            }
        })
    } else {
        res.json({response:false, message:'Le mot de passe ou l\'email contient trop de caractère'})
    }
    
}

export default connectSUBController