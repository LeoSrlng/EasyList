import React, {Fragment} from 'react';
import axios from "axios"
import { BASE_URL, BASE_IMG } from './config_front/API.js'
import { useLocation } from 'react-router-dom'
import { Majuscule } from "./config_front/toUppercase.js"
import { ReducerContext } from "./reducer/reducer.js";

function DetailsRecette() {
    
    const navigate = useLocation()
    const recetteID = navigate.pathname.split('/').pop()
    const [detailsRecette, setDetailsRecette] = React.useState(null)
    
    const [statutLike, setStatutLike] = React.useState("disLike")
    const [userID, setUserId] = React.useState("")
    
    const [state, dispatch] = React.useContext(ReducerContext)
    
    React.useEffect(() => {
            
        setUserId(state.userInfo.id)
        
        axios.get(`${BASE_URL}/detailsRecette/${recetteID}`, {
            params: {
                userID
            }
        })
        .then((res) => {
            // si tout ce passe bien :
            setDetailsRecette(res.data.recette)
            setStatutLike(res.data.like)
        })
        .catch((err) => {
            console.log(err);
        })
        
    });
    
    const toggleLike = () => {
        
        if (statutLike === "liked") {
            
            axios.post(`${BASE_URL}/disLikeRecette/${recetteID}`)
            .then((res) => {
                setStatutLike("disLike")
            })
            .catch((err) => {
                console.log(err);
            })
        } else if (statutLike === "disLike") {
            
            axios.post(`${BASE_URL}/likeRecette/${recetteID}`,{
                userID
            })
            .then((res) => {
                setStatutLike("liked")
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }
    
    return (
        <section className="container details-dimension">
        {detailsRecette !== null &&(            // Si detailsRecette n'est pas egal a null alors on execute le code ci-dessous
            <div className="details-wrapp">
                <h2 className="details-title">{Majuscule(detailsRecette.titre)}</h2>
                <div className="details-wrap-img-list">
                    <img alt="image de la recette" className="img-details" src={`${BASE_IMG}/img_Recettes/${detailsRecette.img}`}/>
                    {state.logUser &&
                        <button aria-label="btn-like" className="like-button" onClick={toggleLike}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path className={statutLike} d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                            </svg>
                        </button>
                    }
                    <ul className="details-list">
                        {detailsRecette.ingredients[0] && detailsRecette.ingredients.map((item, i) =>       // Si detailsRecette.ingredients[0] contient quelque chose alors on execute le mapping
                            <li key={i}>- {Majuscule(item.nom)} : {item.volume}{item.valeur}.</li>
                        )}
                    </ul>
                </div>
                <p className="details-description">{Majuscule(detailsRecette.description)}</p>
            </div>
        )}
        </section>
    )
}

export default DetailsRecette