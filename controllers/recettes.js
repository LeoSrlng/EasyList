import {pool} from '../config/dataBase.js'

const recettesController = (req, res) => {
    
    let Recettes = "SELECT id, titre, categories_ID, image FROM Recettes"
    
    pool.query(Recettes, (err, resultreq) => {
        if (err) throw err
        
        if (resultreq) {
            const recettes = resultreq
            res.json({response:true, recettes})
        } else {
            res.json({response:false})
        }
    })
}

export default recettesController