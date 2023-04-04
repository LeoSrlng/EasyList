import React from 'react';
import axios from "axios"
import {BASE_URL, BASE_IMG} from './config_front/API.js'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import DataList from './DataList'
import { Majuscule } from "./config_front/toUppercase.js"

function ShowDetailSuggestions() {
    
    const path = useLocation()
    const [detailsRecette, setDetailsRecette] = React.useState({})
    const [title, setTitle] = React.useState('')
    const [categories_id, setCategories_id] = React.useState('')
    const [descri, setDescri] = React.useState('')
    const [ingredients, setIngredients] = React.useState([{id:0, ingredient:{value:'',id:null}, quantite:{value:'',id:null}, unite:{value:'',id:null}}])
    
    const [show, setShow] = React.useState(false)
    const [recetteID, setRecetteID] = React.useState('')
    
    const [allIngredient, setAllIngredient] = React.useState([])
    const [allQuantite, setAllQuantite] = React.useState([])
    const [allUnite, setAllUnite] = React.useState([])
    
    React.useEffect(() => {
        const recetteId = path.pathname.split('/').pop()
        setRecetteID(recetteId)
        axios.get(`${BASE_URL}/showEditSuggestions/${recetteId}`)
        .then((res) => {
            // si tout ce passe bien :
            setDetailsRecette(res.data.recette)
            setTitle(res.data.recette.titre)
            setDescri(res.data.recette.description)
            setIngredients(res.data.recette.ingredients)
            setAllIngredient(res.data.ingredients)
            setAllQuantite(res.data.quantites)
            setAllUnite(res.data.unites)
        })
        .catch((err) => {
            console.log(err);
        })
          
    }, []);
    
    const navigate = useNavigate();
    
    const subForm = (e) => {
        e.preventDefault();
        
        const dataFile = new FormData();
        let files = {...e.target.image.files};
        
        // ajouter d'autre input au formulaire
        dataFile.append('ingredients', JSON.stringify(ingredients))
        
        // ajouter d'autre input au formulaire
        dataFile.append('titre', title)
        
        // ajouter d'autre input au formulaire
        dataFile.append('description', descri)
        
        // ajouter d'autre input au formulaire
        dataFile.append('categories_id', categories_id)
        
        // L'image
        if (files[0]) {
            dataFile.append('files', files[0], files[0].name)
            dataFile.append('actualFiles', detailsRecette.img)
        } else {
            dataFile.append('actualFiles', detailsRecette.img)
        }
        
        axios.post(`${BASE_URL}/editSuggestions/${recetteID}`,dataFile)
        .then((res) => {
            if (res.data.response === true) {
                navigate("/admin")
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
    
    const getIdBdd = (value, type) => {
        const array = type === 'ingredient' ? allIngredient : type === 'quantite' ? allQuantite : allUnite
        let index = null
        array.map((e,i) => {
            if(e.nom === value){
                index = e.id
            } 
        })
        return index
    }
    
    
    const handleChange = (e, id, type) => {
        const bddId = getIdBdd(e.target.value, type)
        const value = {[type]:{value:e.target.value,id:bddId}}
        const data = [...ingredients]
        data[id] = {...data[id], ...value}
        setIngredients(data)
    }
    
    const addInput = (e) => {
        e.preventDefault()
        const data = [...ingredients]
        const value = {id:data.length, ingredient:{value:'',id:null}, quantite:{value:'',id:null}, unite:{value:'',id:null}}
        data.push(value)
        setIngredients(data)
    }
    
    const removeInput = (e) => {
        e.preventDefault()
        const data = [...ingredients]
        data.pop()
        setIngredients(data)
    }
    
    return (
        <section className="container dimension-add-edit">
            {Object.keys(detailsRecette).length !== 0 &&
                <React.Fragment>
                    <NavLink aria-label="btn-retour" to="/admin">Retour</NavLink>
                    <form method='post' onSubmit={subForm} encType="multipart/form-data" className="form-add-edit">
                        <div className="wrapper-img-eddit">
                            <h3>Image actuelle</h3>
                            <img className="img-eddit" src={`${BASE_IMG}/img_Recettes/${detailsRecette.img}`} alt='image de la recette'/>
                        </div>
                        <div className="wrapper1">
                            <input className="resp-input-title" type='text' name='title' maxLength="23" value={Majuscule(title)} onChange={(e) => setTitle(e.target.value)} />
                            <label for="file" className="label-file">Choisir une image</label>
                            <input id="file" type="file" className="input-file" name="image"/>
                            <select className="resp-select" name='categories_id' onChange={(e) => setCategories_id(e.target.value)} required>
                                <option value="" >--Veuillez choisir une categorie--</option>
                                <option value='1'>entrée</option>
                                <option value='2'>plat</option>
                                <option value='3'>dessert</option>
                            </select>
                        </div>
                        <textarea name="description" value={Majuscule(descri)} onChange={(e) => setDescri(e.target.value)}></textarea>
                        
                        
                        <div className="input-wrapper">
                            {ingredients.length !== 0 && ingredients.map((item,index) =>
                                <div className="input-solo-wrapper" key={index}>
                                    <DataList 
                                        list={allIngredient}
                                        value={Majuscule(item.ingredient.value)} 
                                        onChange={(e)=> handleChange(e, item.id, 'ingredient')}
                                        name={`ingredient-${index}`} placeholder={'ingredient'}
                                    />
                                    <DataList 
                                        list={allQuantite}
                                        value={Majuscule(item.quantite.value)}
                                        onChange={(e)=> handleChange(e, item.id, 'quantite')}
                                        name={`quantite-${index}`}
                                        placeholder={'quantite'}
                                    />
                                    <DataList 
                                        list={allUnite}
                                        value={Majuscule(item.unite.value)}
                                        onChange={(e)=> handleChange(e, item.id, 'unite')}
                                        name={`unite-${index}`}
                                        placeholder={'unite'}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="add-supp-input">
                            <button aria-label="btn-ajout-ingredients" className="btn-add-edit" onClick={addInput}>Ajouter un ingrédient</button>
                            <button aria-label="btn-suppression-ingredients" className="btn-add-edit" onClick={removeInput}>Retirer un ingrédient</button>
                        </div>
                        <input type='submit' value='Ajouter la recette' />
                    </form>
                </React.Fragment>
            }
        </section>
    )
}

export default ShowDetailSuggestions