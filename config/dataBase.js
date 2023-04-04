import mysql from 'mysql'
import util from "util"

let pool  = mysql.createPool({
  connectionLimit : 10000,
    host: "db.3wa.io",// on rentre l'hôte, l'adresse url où se trouve la bdd
    user: "leosarlange", // identifiant BDD
    password: "e32d3133e758f5971f9ed84dbfff61d0", // le password
    database: "leosarlange_Easy_List", // nom de la base de donnée
});

// pour creer des requet sql async
export const query = util.promisify(pool.query).bind(pool)

// permet d'obtenir le resultat des requete sql async
const asyncQuery = async (sql, params) => {
    try {
        const rows = await query(sql, params)
        return rows
    } catch(err) {
        console.log(err)
    }
}

export {pool, asyncQuery}