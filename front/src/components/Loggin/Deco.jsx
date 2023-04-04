import React, {useContext} from "react"
import { ReducerContext } from "../reducer/reducer.js";
import {LOGOUT} from '../config_front/constante.js'
import { useNavigate } from "react-router-dom";
import axios from "axios"

const Deco = () => {
    
    const [state, dispatch] = useContext(ReducerContext)
    
    const navigate = useNavigate();
    
    const submit = (e) => {
        e.preventDefault()
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('superToken')
        delete axios.defaults.headers.common['Authorization']
        dispatch({type:LOGOUT})
        navigate("/", { replace: true });
    }
    
    const noSubmit = () => {
        navigate("/", { replace: true });
    }
    
    return (
        <section className="container deco-dimension">
        <h1 className="title-deco">Voulez-vous vraiment vous déconnecter?</h1>
        <div>
            <button aria-label="btn-deconnexion-on" className="btn-deco" onClick={submit} >oui</button>
            <button aria-label="btn-deconnexion-off" className="btn-deco" onClick={noSubmit} >non</button>
        </div>
        </section>
        )
};

export default Deco;