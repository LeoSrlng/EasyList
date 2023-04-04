import {pool, asyncQuery} from '../config/dataBase.js'
import formidable from "formidable";
import fs from 'fs'
import {removeDoublon} from "./addRecette.js";

const showEditSuggestionsController = async (req, res) => {
    
    let sqlSelectRecettes = "SELECT * FROM Suggestions_Recettes WHERE id = ?"
    let sqlSelectIngredients = "SELECT * FROM Suggestions_Ingredients ORDER BY nom"
    let sqlSelectQuantites = "SELECT * FROM Suggestions_Quantites ORDER BY nom"
    let sqlSelectUnites = "SELECT * FROM Suggestions_Unites ORDER BY nom"
    let sqlSelectRecettesIngredients = "SELECT Suggestions_Ingredients.nom AS ingredients, Suggestions_Ingredients.id AS ingredients_id, Suggestions_Quantites.nom AS quantites, Suggestions_Quantites.id AS quantites_id, Suggestions_Unites.id AS unites_id, Suggestions_Unites.nom AS valeur FROM Suggestions_Recettes_Ingredients JOIN Suggestions_Ingredients ON Suggestions_Recettes_Ingredients.ingredients_ID = Suggestions_Ingredients.id JOIN Suggestions_Quantites ON Suggestions_Recettes_Ingredients.quantites_ID = Suggestions_Quantites.id JOIN Suggestions_Unites ON Suggestions_Recettes_Ingredients.unites_ID = Suggestions_Unites.id WHERE Suggestions_Recettes_Ingredients.recettes_ID = ?"
    
    
    const resultRecette = await asyncQuery(sqlSelectRecettes, req.params.id)
    const resultIngredients = await asyncQuery(sqlSelectIngredients)
    const resultQuantites = await asyncQuery(sqlSelectQuantites)
    const resultUnites = await asyncQuery(sqlSelectUnites)
    const resultRecettesIngredients = await asyncQuery(sqlSelectRecettesIngredients, req.params.id)
    
    const recette = {
        titre:resultRecette[0].titre,
        description:resultRecette[0].description,
        img:resultRecette[0].image,
        ingredients:[]
    }
    
    for (let i = 0; i < resultRecettesIngredients.length; i++) {
        
        recette.ingredients.push({id: i, ingredient:{value:resultRecettesIngredients[i].ingredients ,id:resultRecettesIngredients[i].ingredients_id}, quantite:{value:resultRecettesIngredients[i].quantites,id:resultRecettesIngredients[i].quantites_id}, unite:{value:resultRecettesIngredients[i].valeur,id:resultRecettesIngredients[i].unites_id}})
    }
    
    res.json({response:true, ingredients: resultIngredients, quantites: resultQuantites, unites: resultUnites, recette})
}

const sqlUpdRecettes = "UPDATE Recettes SET titre = ?, categories_ID = ?, description = ?, image = ? WHERE id = ?"
const sqlUpdRecIngr = "UPDATE Recettes_Ingredients SET ingredients_ID = ?, unites_ID = ?, quantites_ID = ? WHERE id = ?"
const sqlInsRecIngr = "INSERT INTO Recettes_Ingredients (recettes_ID, ingredients_ID, unites_ID, quantites_ID) VALUES ?"
const sqlSelectIdRecIngr = "SELECT id FROM Recettes_Ingredients WHERE recettes_ID = ?"

const sqlDelRecIngr = "DELETE FROM Recettes_Ingredients WHERE id = ?"
    
const sqlUniteIns = "INSERT INTO Unites(nom) VALUE ?"
const sqlQuantitesIns = "INSERT INTO Quantites (nom) VALUE ?"
const sqlIngredientsIns = "INSERT INTO Ingredients (nom) VALUE ?"

const editSuggestionsController = (req, res) => {
    
    const form = formidable({keepExtensions: true});
    
    // Etape 1
    form.parse(req, async(err, fields, files) => {
        if (err) throw err;
    
    // Etape 1.1
        if (files.files) {
           let newFilename = files.files.newFilename;
            let oldPath = files.files.filepath;
            let newPath = `public/images/img_Recettes/${newFilename}`;
            const file = files.files
            
            let actualFilename = fields.actualFiles;
            
            if (files.originalFilename !== '') {
                
                // Etape 1.2
                if (checkAcceptedExtensions(file)) {
                    
                    // ici je supprime l'ancienne image du dossier public
                    fs.unlinkSync(`public/images/img_Recettes/${actualFilename}`)
                    
                    // ici j'enregistre ma nouvelle image dans le dossier public
                    fs.copyFileSync(oldPath, newPath)
                }
            }
            const data = JSON.parse(fields.ingredients)
            /* Exemple de data
                data = [
                    {
                        id:0, 
                        ingredient:{value:'Tomate',id:9},
                        quantite:{value:'3',id:8},
                        unite:{value:'kilo',id:5}
                         
                    },
                    {
                        id:1, 
                        ingredient:{value:'Creme fraiche',id:undefined},
                        quantite:{value:'30',id:null},
                        unite:{value:'ml',id:null}
                    }
                ]
            */
            const domReqRecettes = [fields.titre.toLowerCase(), fields.categories_id.toLowerCase(), fields.description.toLowerCase(), newFilename, req.params.id]
            
            const addRecette = await asyncQuery(sqlUpdRecettes,domReqRecettes)
            
            // Etape 1.3 ==> Etape 2
            const result = await createRecetteIngredient(data,addRecette.insertId)
            
            await removeDoublon('unite')
            await removeDoublon('quantite')
            await removeDoublon('ingredient')
            
            res.json({response:true})
        } else {
            
            const data = JSON.parse(fields.ingredients)
            /* Exemple de data
                data = [
                    {
                        id:0, 
                        ingredient:{value:'Tomate',id:9},
                        quantite:{value:'3',id:8},
                        unite:{value:'kilo',id:5}
                         
                    },
                    {
                        id:1, 
                        ingredient:{value:'Creme fraiche',id:undefined},
                        quantite:{value:'30',id:null},
                        unite:{value:'ml',id:null}
                    }
                ]
            */
            const domReqRecettes = [fields.titre.toLowerCase(), fields.categories_id.toLowerCase(), fields.description.toLowerCase(), fields.actualFiles, req.params.id]
            
            const addRecette = await asyncQuery(sqlUpdRecettes,domReqRecettes)
            
            // Etape 1.3 ==> Etape 2
            const result = await createRecetteIngredient(data, req.params.id)
            
            await removeDoublon('unite')
            await removeDoublon('quantite')
            await removeDoublon('ingredient')
            
            res.json({response:true})
        }
    })
    
    // Etape 1.2
    // ici je verifie le type du fichier uploadé
     const checkAcceptedExtensions = (file) => {
    	const type = file.mimetype.split('/').pop()
    	const accepted = ['jpeg', 'jpg', 'png', 'gif']
    	if (accepted.includes(type)) {
    	    return true
    	}
    	return false
    }
}

        // Etape 2
const createRecetteIngredient = async (data, idRecette) => {
    
    // Etape 2.1 ==> Etape 3
    // retourne les index des id egalent a null comme ceci {quantite:[0,3,5], unite:[1,2,3], ingredient:[2]}
    const idToUpdate = await getArrayIdOfNewData(data) 
    
    // Etape 2.2 ==> Etape 4
    // retourne les insertId de chaques requette pour chaques categories comme ceci {unite: 13, quantite: 9, ingredient: 20}
    const insertId = await insertNewData(data)
     
    // Etape 2.3 ==> Etape 5
    // retourn le tableau de toute les ingredient quantité et unité mis a jour comme ceci :
    // [
    //   {
    //     id: 0,
    //     ingredient: { value: 'tomate', id: 1 },
    //     quantite: { value: '1', id: 1 },
    //     unite: { value: 'litres', id: 2 }
    //   },
    //   {
    //     id: 1,
    //     ingredient: { value: 'viande hachée', id: 21 },
    //     quantite: { value: '10', id: 24 },
    //     unite: { value: 'teste1', id: 49 }
    //   },
    //   {
    //     id: 2,
    //     ingredient: { value: 'caramel', id: 35 },
    //     quantite: { value: '25', id: 32 },
    //     unite: { value: 'gousse', id: 38 }
    //   }
    // ]
    const dataUpdated = await updateIdOfNewData(insertId, idToUpdate, data)
    
    // Etape 2.4 ==> Etape 6
    // affilie les ingredients, les quantites et les unites a la recette courante
    const result = await insertRecetteIngredient(dataUpdated, idRecette)
    
    return result
}

        //  Etape 3
const getArrayIdOfNewData = async (data) => {
    
    // ici je declare les tableaux dans lesquelles j'enregistrerai les index des id qui sont a null
    const quantite = []     // [0,3,5]
    const unite = []        // [1,2,3]
    const ingredient = []   // [2]
    
    for (let i = 0; i <= data.length; i++) {
        
        if (i === data.length) {
            return {quantite, unite, ingredient}
        }
        // si l'id est null je sauvegarde l'index pour le mettre a jour plus tard 
        data[i].ingredient.id === null && ingredient.push(i)
        data[i].quantite.id === null && quantite.push(i)
        data[i].unite.id === null && unite.push(i)
    }
}

        //  Etape 4
const insertNewData = async (data) => {
    
    // ici je declare les tableaux dans lesquelles j'enregistrerai les nom des éléments qui sont a null
    
    const quantite = []     // [[["30"]],[["50"]],[["1"]]]
    const unite = []        // [[["kilo"]], [["ml"]]]
    const ingredient = []   // [[["creme fraiche"]], [["tomate"]]]
    
    for (let i = 0; i <= data.length; i++) {
        
        if (i === data.length) {
            
            // Etape 4.1
            // une fois que la boucle for est terminé j'envois mon tableaux d'unités à l'étape d'apres afin de les push en BDD et de recuperer leurs insertId
            const resultUnite = unite[0] ? await insertUnite(unite) : 0
            
            // Etape 4.2
            // une fois que la boucle for est terminé j'envois mon tableaux de quantités à l'étape d'apres afin de les push en BDD et de recuperer leurs insertId
            const resultQuantite = quantite[0] ? await insertQuantite(quantite): 0
            
            // Etape 4.3
            // une fois que la boucle for est terminé j'envois mon tableaux d'ingrédients à l'étape d'apres afin de les push en BDD et de recuperer leurs insertId
            const resultIngredient = ingredient[0] ? await insertIngredient(ingredient): 0
            
            // ici je push les insertId de chaques categories dans un objet "result"
            const result = {
                unite: resultUnite, // 13
                quantite:resultQuantite, // 9
                ingredient:resultIngredient // 20
            }
            return result
        }
        // si l'id est null je sauvegarde le nom pour l'ajouter a la BDD
        data[i].ingredient.id === null && ingredient.push([[data[i].ingredient.value]])
        data[i].quantite.id === null && quantite.push([[data[i].quantite.value]])
        data[i].unite.id === null && unite.push([[data[i].unite.value]])
    }
}

        // Etape 4.1
// requete SQL pour ajouter toutes mes nouvelles unités et retourner l'insertID ou null si pas d'ajout
const insertUnite = async (nom) => {
    const uniteID = await asyncQuery(sqlUniteIns,[nom])
    return uniteID.insertId ? uniteID.insertId : null 
}

        // Etape 4.2
// requete SQL pour ajouter toutes mes nouvelles quantités et retourner l'insertID ou null si pas d'ajout
const insertQuantite = async (nom) => {
    const quantiteID = await asyncQuery(sqlQuantitesIns,[nom])
    return quantiteID.insertId ? quantiteID.insertId : null 
}

        // Etape 4.3
// requete SQL pour ajouter tout mes nouveaux ingredients et retourner l'insertID ou null si pas d'ajout
const insertIngredient = async (nom) => {
    const ingredientID = await asyncQuery(sqlIngredientsIns,[nom])
    return ingredientID.insertId ? ingredientID.insertId : null 
}

        // Etape 5
const updateIdOfNewData = async (insertId, idToUpdate, data) => {
    let newData = [...data]
        
        //  Etape 5.1
    // renvoie le tableau des ingredient avec l'id de unité mis a jour
    const uniteDataUpdated = await updateIdOfElement(insertId, idToUpdate, newData, 'unite')
    newData = [...uniteDataUpdated]

        //  Etape 5.2
    // renvoie le tableau des ingredient avec l'id de quantite mis a jour
    const quantiteDataUpdated = await updateIdOfElement(insertId, idToUpdate, newData, 'quantite')
    newData = [...quantiteDataUpdated]
    
        //  Etape 5.3
     // renvoie le tableau des ingredient avec l'id de quantite mis a jour
    const ingredientDataUpdated = await updateIdOfElement(insertId, idToUpdate, newData, 'ingredient')

    return ingredientDataUpdated
}

    // Etape 5.1 à 5.3
// met a jour les id qui sont a null a partir de l'insertId
const updateIdOfElement = async (insertId, idToUpdate, data, type) => {
    
    const newData = [...data]
    
    // ici je recupere l'insertId qui correspond au type que je traitre a l'instant T
    let insertIdElement = insertId[type]
    
    // dans cette boucle je procede a la mis a jour de l'id de chaques element grace a son type et son isertId
    for (let index = 0; index <= idToUpdate[type].length; index++) {
        
        if (index === idToUpdate[type].length) {
            return newData
        }
        const id = idToUpdate[type][index];
        newData[id][type].id =  insertIdElement
        insertIdElement++
    }
}

        //  Etape 6
const insertRecetteIngredient = async (data, idRecette) => {
    
    // ici je declare le tableaux qui contiendra les id des ingredients, des quantites et des unites en rapport avec ma recette courante afin de les updates dans la bdd
    const result = []
    
    // requette sql pour recuperer les id a update dans recettes_ingredients
    const idToUpdate = await asyncQuery(sqlSelectIdRecIngr,parseInt(idRecette))
    
    // si je veux rajouter des ingredients je passe dans cette condition
    if (idToUpdate.length < data.length) {
        
        // ici je declare le tableaux qui contiendra les id des ingredients, des quantites et des unites en rapport avec ma recette courante afin de les inserer en bdd
        const valueToInsert = []
        
        // boucle servant a recuperer les valeurs des inputs en plus pour les inserer en bdd
        for (let i = idToUpdate.length; i < data.length; i++) {
            
            valueToInsert.push([parseInt(idRecette), data[i].ingredient.id, data[i].unite.id, data[i].quantite.id])
            
            // une fois que j'ai tout recuperer j'execute la requette pour l'insertion
            if (i === data.length - 1) {
                const insRecIngr = await asyncQuery(sqlInsRecIngr,[valueToInsert])
            }
        }
    // si je veux supprimer des ingredients je passe dans cette condition
    } else if (idToUpdate.length > data.length) {
        
        // ici je declare le tableaux qui contiendra les id des ingredients, des quantites et des unites en rapport avec ma recette courante afin de les inserer en bdd
        const valueToDelete = []
        
        // boucle servant a recuperer les valeurs des inputs en moins pour les supprimer en bdd
        for (let ii = data.length; ii < idToUpdate.length; ii++) {
            
            valueToDelete.push(idToUpdate[ii].id)
            
            // une fois que j'ai tout recuperer j'execute la requette pour la suppression
            if (ii === idToUpdate.length - 1) {
                
                for (let iii = 0; iii < valueToDelete.length; iii++) {
                    
                    const delRecIngr = await asyncQuery(sqlDelRecIngr,[valueToDelete[iii]])
                }
            }
        }
    }
    
    // boucle servant a recuperer les valeurs des inputs deja existants pour les updates 
    for (let index = 0; index < data.length; index++) {
        
        result.push([data[index].ingredient.id, data[index].unite.id, data[index].quantite.id, idToUpdate[index].id])
        
        const updRecIngr = await asyncQuery(sqlUpdRecIngr,result[index])
        
        // if (index === data.length - 1) {
        //     console.log('result dnas etape 6')
        //     console.log(updRecIngr)
        //     return updRecIngr
        // }
    }
}

export {editSuggestionsController, showEditSuggestionsController}