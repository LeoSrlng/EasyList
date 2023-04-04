import React from 'react';
import axios from "axios"
import { BASE_URL, BASE_IMG } from './config_front/API.js'
import { NavLink } from 'react-router-dom'
import { Majuscule } from "./config_front/toUppercase.js"

function Admin() {
    
    const [recette, setRecette] = React.useState([])
    const [filter, setFilter] = React.useState('1,2,3')
    
    React.useEffect(() => {

        axios.get(`${BASE_URL}/admin`)
        .then((res) => {
            // si tout ce passe bien :
            setRecette(res.data.recettes)
        })
        .catch((err) => {
            console.log(err);
        })
            console.log(recette)
          
    }, [filter]);
    
    const deleteSub = (e, id) => {
        e.preventDefault()
        let deleteID = id
        axios.post(`${BASE_URL}/deleteRecette`,{
            deleteID
        })
        .then((res) => {
            if(res.data.response){
                let data = [...recette]
                data = data.filter((e) => e.id !== id)
                setRecette(data)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
    
    const Categorie = (categorie_id) => {
        
        if (categorie_id === 1) {
            return "Entrée"
        } else if (categorie_id === 2) {
            return "Plat"
        } else if (categorie_id === 3) {
            return "Dessert"
        }
    }
    
    return (
        <section className="container display-admin">
            <select name="filter" onChange={(e) => setFilter(e.target.value)}>
                <option value="1,2,3">tout</option>
                <option value='1'>entrée</option>
                <option value="2">plat</option>
                <option value="3">dessert</option>
            </select>
            
            <NavLink aria-label="btn-addRecette" className="btn-admin" to="/addRecette/"> Ajouter une recette </NavLink>
            <NavLink aria-label="btn-Suggestions" className="btn-admin" to="/showSuggestions/"> Suggestions Utilisateurs </NavLink>
            
            <table>
                <thead>
                    <tr>
                        <td>Images</td>
                        <td>Titres</td>
                        <td className="resp-tab">Descriptions</td>
                        <td className="resp-tab">Categories</td>
                    </tr>
                </thead>
                {recette.map((item, i) =>
                    <tbody key={i}>
                        {filter.includes(item.categories_ID) &&
                            <tr className="tab-wrapp">
                                <td><img alt="image de la recette" className="img-admin" src={`${BASE_IMG}/img_Recettes/${item.image}`}/></td>
                                <td>{Majuscule(item.titre)}</td>
                                <td className="resp-tab"><p className="admin-responsive">{Majuscule(item.description)}</p></td>
                                <td className="resp-tab"><p>{Categorie(item.categories_ID)}</p></td>
                                <td><button aria-label="btn-suppRecette" className="btn-admin" onClick={(e) => deleteSub(e,item.id)}> Supprimer </button></td>
                                <td><NavLink aria-label="btn-modifRecette" to={"/showEditRecette/" + item.id}> Modifier </NavLink></td>
                            </tr>
                        }
                    </tbody>
                )}
            </table>
        </section>
    )
}

export default Admin

