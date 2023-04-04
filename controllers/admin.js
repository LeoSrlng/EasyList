import {pool} from '../config/dataBase.js'
import fs from 'fs'

const adminController = (req, res) => {
    
    let Recettes = "SELECT Recettes.id, Recettes.titre, Recettes.description, Recettes.image, Recettes.categories_ID, Categories.nom AS categorie FROM Recettes JOIN Categories ON Categories.id = categories_ID"
    
    pool.query(Recettes, (err, resultrecettes) => {
        if (err) throw err
        
        res.json({response:true, recettes: resultrecettes})
    })
}

const deleteRecetteController = (req, res) => {
    
    let deleteRecettes = "DELETE Recettes, Recettes_Ingredients FROM Recettes INNER JOIN Recettes_Ingredients ON Recettes_Ingredients.recettes_ID = Recettes.id WHERE Recettes.id = ?"
    let deleteImg = "SELECT Recettes.image FROM Recettes WHERE id = ?"
    
    pool.query(deleteImg, [req.body.deleteID], (err, imgToDelete) => {
        if (err) throw err
        
        pool.query(deleteRecettes, [req.body.deleteID], (err, resultdel) => {
            if (err) throw err
            
            fs.unlink("public/images/img_Recettes/" + imgToDelete[0].image, (err) => {
                if (err) throw err
                
                res.json({response:true})
            })
        })
    })
}

export {adminController, deleteRecetteController}