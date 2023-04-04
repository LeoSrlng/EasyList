import {asyncQuery, pool} from '../config/dataBase.js'

const commonHomeController = async (req, res) => {
    
    const Recettes = "SELECT id, titre, image FROM Recettes where id = ?"
    
    const entree1 = await asyncQuery(Recettes, 58)
    
    const entree2 = await asyncQuery(Recettes, 60)
    
    const plat1 = await asyncQuery(Recettes, 61)
    
    const plat2 = await asyncQuery(Recettes, 62)
    
    const dessert1 = await asyncQuery(Recettes, 66)
    
    const dessert2 = await asyncQuery(Recettes, 68)
                            
    let cdc = [entree1[0], entree2[0], plat1[0], plat2[0], dessert1[0], dessert2[0]]
    
    res.json({response:true, cdc})
}

const userHomeController = async (req, res) => {
    
    const selectFavoris = "SELECT Recettes.id, titre, image, categories_id FROM Recettes INNER JOIN Users_Recettes ON Recettes.id = Users_Recettes.recettes_ID WHERE Users_Recettes.users_ID = ?"
    
    const favoris = await asyncQuery(selectFavoris, req.query.userID)
    
    const entre = []
    
    const plat = []
    
    const dessert = []
    
    for (let i = 0; i < favoris.length; i++) {
        
        if (favoris[i].categories_id === 1) {
            
            entre.push(favoris[i])
            
        } else if (favoris[i].categories_id === 2) {
            
            plat.push(favoris[i])
            
        } else if (favoris[i].categories_id === 3) {
            
            dessert.push(favoris[i])
            
        }
    }
    
    const lenghtEntre = entre.length
    
    if (lenghtEntre < 3) {
        
        for (let ii = lenghtEntre; ii < 3; ii++) {
            entre.push({image:"bgBaseHome.png", id:58})
        }    
    }
    
    const lenghtPlat = plat.length
    
    if (lenghtPlat < 3) {
        
        for (let ii = lenghtPlat; ii < 3; ii++) {
            plat.push({image:"bgBaseHome.png", id:61})
        }    
    }
    
    const lenghtDessert = dessert.length
    
    if (lenghtDessert < 3) {
        
        for (let ii = lenghtDessert; ii < 3; ii++) {
            dessert.push({image:"bgBaseHome.png", id:68})
        }    
    }
    
    const newLenghtEntre = entre.length
    
    const newLenghtPlat = plat.length
    
    const newLenghtDessert = dessert.length
    
    res.json({response:true, entre, newLenghtEntre, plat, newLenghtPlat, dessert, newLenghtDessert})
}

export {commonHomeController, userHomeController}