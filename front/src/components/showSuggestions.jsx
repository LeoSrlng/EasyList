import React from 'react';
import axios from "axios"
import { BASE_URL, BASE_IMG } from './config_front/API.js'
import { NavLink } from 'react-router-dom'
import { Majuscule } from "./config_front/toUppercase.js"

function ShowSuggestions() {
    
    const [recette, setRecette] = React.useState([])
    const [filter, setFilter] = React.useState('1,2,3')
    const [filterState, setFilterState] = React.useState("d-none")
    
    React.useEffect(() => {

        axios.get(`${BASE_URL}/showSuggRecette`)
        .then((res) => {
            // si tout ce passe bien :
            setRecette(res.data.resultRecettes)
        })
        .catch((err) => {
            console.log(err);
        })
          
    }, [filter]);
    
    const toggleFilter = (e, value) => {
        e.preventDefault();
        
        setFilter(value)
    }
    
    const toggleFilterBar = () => {
        
        if (filterState === "d-none") {
            
            setFilterState("d-flex")
        } else if (filterState === "d-flex") {
            
            setFilterState("d-none")
        }
        
    }
    
    return (
        <section className="container">
            <button aria-label="btn-filtre" className="btn-filtre" onClick={toggleFilterBar}>
                Filtre
                <svg className="svg-size" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 512">
                    <path className="svg-filtre" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>
                </svg>
                <ul className={"ul-filtre " + filterState}>
                    <li>
                        <button className="li-filtre" aria-label="btn-setFiltre" onClick={(e) => toggleFilter(e, "1,2,3")}>Tout</button>
                    </li>
                    <li>
                        <button className="li-filtre" aria-label="btn-setFiltre" onClick={(e) => toggleFilter(e, "1")}>Entre</button>
                    </li>
                    <li>
                        <button className="li-filtre" aria-label="btn-setFiltre" onClick={(e) => toggleFilter(e, "2")}>Plat</button>
                    </li>
                    <li>
                        <button className="li-filtre" aria-label="btn-setFiltre" onClick={(e) => toggleFilter(e, "3")}>Dessert</button>
                    </li>
                </ul>
            </button>
            {recette.map((item, i) =>
                <React.Fragment key={i}>
                    {filter.includes(item.categories_ID) &&
                        <React.Fragment>
                            <hr/>
                            <article className="recette">
                                <NavLink aria-label="btn-detailRecette" className="btn-recette" to={"/showDetailSuggestions/" + item.id}>
                                    <img alt="image de la recette" className="img-recette" src={`${BASE_IMG}/img_Suggestions_Recettes/${item.image}`}/>
                                    <h2>{Majuscule(item.titre)}</h2>
                                </NavLink>
                            </article>
                        </React.Fragment>
                    }
                </React.Fragment>
            )}
        </section>
    )
}

export default ShowSuggestions
















