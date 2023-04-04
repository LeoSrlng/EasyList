import {pool, asyncQuery} from '../config/dataBase.js'
import formidable from "formidable";
import fs from 'fs'

const verifSuggRecetteController = async (req, res) => {
    
    let sqlSelectIngredients = "SELECT * FROM Ingredients ORDER BY nom"
    let sqlSelectQuantites = "SELECT * FROM Quantites ORDER BY nom"
    let sqlSelectUnites = "SELECT * FROM Unites ORDER BY nom"
    
    const resultIngr = await asyncQuery(sqlSelectIngredients)
    const resultQuant = await asyncQuery(sqlSelectQuantites)
    const resultUnit = await asyncQuery(sqlSelectUnites)
                
    res.json({response:true, ingredients: resultIngr, quantites: resultQuant, unites: resultUnit})
    
}

// idée: recuperer juste le nom de l'ingredient/quantite/unite pour les push dans mes tables suggestion

const sqlInsSuggRecettes = "INSERT INTO Suggestions_Recettes (titre, categories_ID, description, image) VALUES (?,?,?,?)"
const sqlInsSuggRecIngr = "INSERT INTO Suggestions_Recettes_Ingredients (recettes_ID, ingredients_ID, unites_ID, quantites_ID) VALUES ?"

const sqlSuggUniteIns = "INSERT INTO Suggestions_Unites(nom) VALUE ?"
const sqlSuggQuantitesIns = "INSERT INTO Suggestions_Quantites (nom) VALUE ?"
const sqlSuggIngredientsIns = "INSERT INTO Suggestions_Ingredients (nom) VALUE ?"

const suggRecetteController = async (req, res) => {
    
    const form = formidable({keepExtensions: true});
    
    // Etape 1
    form.parse(req, async(err, fields, files) => {
        if (err) throw err;
    
    // Etape 1.1    
        let newFilename = files.files.newFilename;
        let oldPath = files.files.filepath;
        let newPath = `public/images/img_Suggestions_Recettes/${newFilename}`;
        const file = files.files
        
        if (files.originalFilename !== '') {
            
            // Etape 1.2
            if (checkAcceptedExtensions(file)) {
                
                // ici j'enregistre mon fichier dans le dossier public
                fs.copyFile(oldPath, newPath, (err) => {
                    if (err) throw err;
                })
            }
        }
        
        const data = JSON.parse(fields.ingredients)
        console.log(JSON.parse(fields.ingredients))
        let domReqRecettes = [fields.titre.toLowerCase(), fields.categories_id.toLowerCase(), fields.description.toLowerCase(), newFilename] 
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
        const addRecette = await asyncQuery(sqlInsSuggRecettes,domReqRecettes)
        
        // Etape 1.3 ==> Etape 2
        const result = await createRecetteIngredient(data,addRecette.insertId)
        
        await removeSuggDoublon('unite')
        await removeSuggDoublon('quantite')
        await removeSuggDoublon('ingredient')
        
        res.json({response:true, result})
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
    const uniteID = await asyncQuery(sqlSuggUniteIns,[nom])
    return uniteID.insertId ? uniteID.insertId : null 
}

        // Etape 4.2
// requete SQL pour ajouter toutes mes nouvelles quantités et retourner l'insertID ou null si pas d'ajout
const insertQuantite = async (nom) => {
    const quantiteID = await asyncQuery(sqlSuggQuantitesIns,[nom])
    return quantiteID.insertId ? quantiteID.insertId : null 
}

        // Etape 4.3
// requete SQL pour ajouter tout mes nouveaux ingredients et retourner l'insertID ou null si pas d'ajout
const insertIngredient = async (nom) => {
    const ingredientID = await asyncQuery(sqlSuggIngredientsIns,[nom])
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
    
    // ici je declare le tableaux qui contiendra les id des ingredients, des quantites et des unites en rapport avec ma recette courante
    const result = []
    
    for (let index = 0; index <= data.length; index++) {
        
        result.push([idRecette, data[index].ingredient.id, data[index].unite.id, data[index].quantite.id])
        
        if (index === data.length) {
            
            const insRecIngr = await asyncQuery(sqlInsSuggRecIngr,[result])
            return insRecIngr
        }
    }
}

        // Etape 7
const removeSuggDoublon = async (type) => {
    
    const data = {
        unite:{
            sqlGetDoublon:'SELECT COUNT(nom) AS nb, nom FROM Suggestions_Unites GROUP BY nom HAVING COUNT(nom) > 1',
            sqlGetIdToDelete:'SELECT id FROM Suggestions_Unites WHERE nom = ? ORDER BY id DESC LIMIT 1',
            sqlUpdateID: `UPDATE Suggestions_Recettes_Ingredients SET unites_ID = (SELECT id FROM Suggestions_Unites WHERE nom = ? ORDER BY id ASC LIMIT 1) WHERE unites_ID = (SELECT id FROM Suggestions_Unites WHERE nom = ? ORDER BY id DESC LIMIT 1)`,
            sqlDeleteDoublon: "DELETE FROM `Suggestions_Unites` WHERE id = ?"
        },
        quantite:{
            sqlGetDoublon:'SELECT COUNT(nom) AS nb, nom FROM Suggestions_Quantites GROUP BY nom HAVING COUNT(nom) > 1',
            sqlGetIdToDelete:'SELECT id FROM Suggestions_Quantites WHERE nom = ? ORDER BY id DESC LIMIT 1',
            sqlUpdateID: `UPDATE Suggestions_Recettes_Ingredients SET quantites_ID = (SELECT id FROM Suggestions_Quantites WHERE nom = ? ORDER BY id ASC LIMIT 1) WHERE unites_ID = (SELECT id FROM Suggestions_Quantites WHERE nom = ? ORDER BY id DESC LIMIT 1)`,
            sqlDeleteDoublon: "DELETE FROM Suggestions_Quantites WHERE id = ?"
        },
        ingredient:{
            sqlGetDoublon:'SELECT COUNT(nom) AS nb, nom FROM Suggestions_Ingredients GROUP BY nom HAVING COUNT(nom) > 1',
            sqlGetIdToDelete:'SELECT id FROM Suggestions_Ingredients WHERE nom = ? ORDER BY id DESC LIMIT 1',
            sqlUpdateID: `UPDATE Suggestions_Recettes_Ingredients SET ingredients_ID = (SELECT id FROM Suggestions_Ingredients WHERE nom = ? ORDER BY id ASC LIMIT 1) WHERE unites_ID = (SELECT id FROM Suggestions_Ingredients WHERE nom = ? ORDER BY id DESC LIMIT 1)`,
            sqlDeleteDoublon: "DELETE FROM Suggestions_Ingredients WHERE id = ?"
        },
    }

    const resultDoublon = await asyncQuery(data[type].sqlGetDoublon)
    for (let i = 0; i < resultDoublon.length; i++) {
        const nbDoublon = resultDoublon[i].nb
        const nom = resultDoublon[i].nom
        for (let j = 1; j < nbDoublon; j++) {
            const idToDelete = await asyncQuery(data[type].sqlGetIdToDelete,[nom])
            const updatedRecette = await asyncQuery(data[type].sqlUpdateID,[nom, nom])
            const deleteDoublon = await asyncQuery(data[type].sqlDeleteDoublon,[idToDelete[0].id])
        }
    }
}

export {suggRecetteController, verifSuggRecetteController}