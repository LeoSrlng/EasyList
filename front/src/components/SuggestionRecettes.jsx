import React from 'react';
import axios from "axios"
import {BASE_URL} from './config_front/API.js'
import { useNavigate } from 'react-router-dom'
import DataList from './DataList'

function SuggestionRecettes() {
    
    const [title, setTitle] = React.useState('')
    const [categories_id, setCategories_id] = React.useState('')
    const [descri, setDescri] = React.useState('')
    const [allIngredient, setAllIngredient] = React.useState([])
    const [allQuantite, setAllQuantite] = React.useState([])
    const [allUnite, setAllUnite] = React.useState([])
    const [ingredients, setIngredients] = React.useState([{id:0, ingredient:{value:'',id:null}, quantite:{value:'',id:null}, unite:{value:'',id:null}}]) 
    
    const navigate = useNavigate();
    
    
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
    
    React.useEffect(() => {
        axios.get(`${BASE_URL}/verifSuggRecette`)
        .then((res) => {
            setAllIngredient(res.data.ingredients)
            setAllQuantite(res.data.quantites)
            setAllUnite(res.data.unites)
        })
        .catch((err) => {
            console.log(err);
        })
    }, []);
    
    
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
    
    const subForm = (e) => {
        e.preventDefault()
        
        const dataFile = new FormData();
        const files = {...e.target.image.files};
        // ajouter d'autre input au formulaire
        dataFile.append('ingredients', JSON.stringify(ingredients))
        
        // ajouter d'autre input au formulaire
        dataFile.append('titre', title)
        
        // ajouter d'autre input au formulaire
        dataFile.append('description', descri)
        
        // ajouter d'autre input au formulaire
        dataFile.append('categories_id', categories_id)
        
        // L'image
        dataFile.append('files', files[0], files[0].name)
        
        axios.post(`${BASE_URL}/suggRecette`,dataFile)
        .then((res) => {
            if (res.data.response === true) {
                navigate("/admin")
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
    
    ////////////////////////////////////////////////////////////////
    //////////// METTRE EN PLACE LA VUE DES SUGGESTIONS ////////////
    ////////////////////////////////////////////////////////////////
    
    return (
        <section className="container dimension-add-edit">
            <form method='post' onSubmit={subForm} encType="multipart/form-data" className="form-add-edit">
                <div className="wrapper1">
                    <input className="resp-input-title" type='text' name='title' maxLength="63" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="titre" />
                    <label for="file" className="label-file">Choisir une image</label>
                    <input id="file" type="file" className="input-file" name="image" required />
                    <select className="resp-select" name='categories_id' value={categories_id} onChange={(e) => setCategories_id(e.target.value)} required>
                        <option value="" disabled>--Veuillez choisir une categorie--</option>
                        <option value='1'>entrée</option>
                        <option value='2'>plat</option>
                        <option value='3'>dessert</option>
                    </select>
                </div>
                <textarea name="description" value={descri} onChange={(e) => setDescri(e.target.value)} placeholder="description">{descri}</textarea>
                
                
                <div className="input-wrapper">
                    {ingredients[0] && ingredients.map((item,index) =>
                        <div className="input-solo-wrapper" key={index}>
                            <DataList 
                                list={allIngredient} 
                                value={item.ingredient.value} 
                                onChange={(e)=> handleChange(e, item.id, 'ingredient')}
                                name={`ingredient-${index}`} placeholder={'ingredient'}
                            />
                            <DataList 
                                list={allQuantite}
                                value={item.quantite.value}
                                onChange={(e)=> handleChange(e, item.id, 'quantite')}
                                name={`quantite-${index}`}
                                placeholder={'quantite'}
                            />
                            <DataList 
                                list={allUnite}
                                value={item.unite.value}
                                onChange={(e)=> handleChange(e, item.id, 'unite')}
                                name={`unite-${index}`}
                                placeholder={'unite'}
                            />
                        </div>
                    )}
                </div>
                <div className="add-supp-input">
                    <button aria-label="btn-ajout-ingredients" className="btn-add-edit" onClick={addInput}>Ajouter un ingrédient</button>
                    <button aria-label="btn-retrait-ingredients" className="btn-add-edit" onClick={removeInput}>Retirer un ingrédient</button>
                </div>
                <input type='submit' value='Ajouter la recette' />
            </form>
        </section>
    )
}

export default SuggestionRecettes