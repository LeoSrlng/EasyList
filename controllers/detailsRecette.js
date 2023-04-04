import {pool, asyncQuery} from '../config/dataBase.js'

const detailsRecetteController = async (req, res) => {

    const sqlSelectRecettes = "SELECT Recettes.titre, Recettes.description, Recettes.image FROM Recettes WHERE Recettes.id = ?"
    
    const sqlSelectFav = "SELECT recettes_ID FROM Users_Recettes WHERE users_ID = ? AND recettes_ID = ?"
    
    const sqlSelectIngredients = "SELECT Ingredients.nom, Quantites.nom AS volume, Unites.nom AS valeur FROM Recettes_Ingredients JOIN Unites ON Recettes_Ingredients.unites_ID = Unites.id JOIN Quantites ON Recettes_Ingredients.quantites_ID = Quantites.id JOIN Ingredients ON Recettes_Ingredients.ingredients_ID = Ingredients.id WHERE Recettes_Ingredients.recettes_ID = ?"
    
    const resultRecette = await asyncQuery(sqlSelectRecettes, [req.params.id])
            
    const resultIngredients = await asyncQuery(sqlSelectIngredients, [req.params.id])
        
    const recette = {
        titre:resultRecette[0].titre,
        description:resultRecette[0].description,
        img:resultRecette[0].image,
        categorie:resultRecette[0].categories_id,
        ingredients:[]
    }
    
    for (let i = 0; i < resultIngredients.length; i++) {
        
        let result = resultIngredients[i]
        
        if  (result.valeur === "unités") {
            result.valeur = ""
            recette.ingredients.push(result)    
        } else {
            recette.ingredients.push(result)
        }
    }
        
    const resultLike = await asyncQuery(sqlSelectFav, [req.query.userID, req.params.id])
    
    let like;
    
    if (resultLike[0]) {
        
        like = "liked"
        
    } else if (!resultLike[0]) {
        
        like = "disLike"
        
    }
    
    res.json({response:true, recette, like})
}

const likeRecetteController = async (req, res) => {
    
    const sqlInsertFav = "INSERT INTO Users_Recettes (users_ID, recettes_ID) VALUES (?,?)"
    
    const toInsert = [req.body.userID, req.params.id]
    
    const insert = await asyncQuery(sqlInsertFav, toInsert)
    
    res.json({response:true})
    
}

const dislikeRecetteController = async (req, res) => {
    
    const sqlDeleteFav = "DELETE FROM Users_Recettes WHERE recettes_ID = ?"
    
    const toDelete = await asyncQuery(sqlDeleteFav, req.params.id)
    
    res.json({response:true})
}

export {detailsRecetteController, likeRecetteController, dislikeRecetteController}