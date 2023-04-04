import {pool, asyncQuery} from '../config/dataBase.js'

const showsuggRecetteController = async (req, res) => {
    
    const Recettes = "SELECT id, titre, categories_ID, image FROM Suggestions_Recettes"
    
    const resultRecettes = await asyncQuery(Recettes)
    
    res.json({response:true, resultRecettes})
}

export default showsuggRecetteController