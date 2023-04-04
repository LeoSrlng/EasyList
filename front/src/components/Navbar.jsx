import { NavLink, useLocation } from 'react-router-dom';
import React, {Fragment, useContext, useEffect} from "react";
import { ReducerContext } from "./reducer/reducer.js";
import Accessibilite from './Accessibilite.jsx';
import axios from "axios"
import {BASE_URL} from './config_front/API.js'
import { LOGIN, ADMIN } from './config_front/constante'

function Navbar() {
    
    const [classParamNav, setClassParamNav] = React.useState("d-none")
    
    const [showAcces, setShowAcces] = React.useState(false)
     
    const [token, setToken] = React.useState('')
     
    const [theme, setTheme] = React.useState('');
    const [font, setFont] = React.useState('');
    
    const [burger, setBurger] = React.useState('not-active');
    const [classNav, setClassNav] = React.useState("")
    
    const showList = () => {
        
        if (classParamNav === "d-flex") {
            
            setClassParamNav("d-none")
            
        } else if (classParamNav === "d-none") {
            
            setClassParamNav("d-flex")
            
        }
    }
    
    const pathName = useLocation();
    
    React.useEffect(() => {
        
        window.scrollTo(0, 0);
          
    }, [pathName.pathname]);
    
    const showAccess = (e) => {
         e.preventDefault();
         
        if (showAcces) {
            setShowAcces(false)
            setClassParamNav("d-none")
        } else {
            setClassParamNav("d-none")
            setShowAcces(true)
        }
    }
    
    const [state, dispatch] = useContext(ReducerContext)
  
    useEffect(() => {
        
        setTheme(localStorage.getItem("theme"))
        setFont(localStorage.getItem("font"))
        setToken(localStorage.getItem("jwtToken"))
        
    }, []);
    
    useEffect(() => {
        
        axios.post(`${BASE_URL}/isLogged`,{
            token
        })
        .then((res) => {
          if (res.data.token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
          }
          res.data.logged && dispatch({type:LOGIN, payload:res.data.infoUser})
          res.data.admin && dispatch({type:ADMIN, payload:res.data.infoUser})
        })
        .catch((err) => {
          console.log(err)
        })
        
    }, [token]);
    
    useEffect(() => {
        
        if (theme || font) {
            document.body.className = `${theme} ${font}`;    
        }
        
    }, [theme, font]);
    
    const toggleBurger = () => {
        
        if (burger === "not-active") {
            setBurger("active")
            setClassNav("open-burger")
        } else if (burger === "active") {
            setBurger("not-active")
            setClassNav("")
        }
    }
    
    return (
        <Fragment>
            <nav>
                <div className="nav-wrap">
                    <button aria-label="btn-burger" className={"btn-burger " + burger} onClick={toggleBurger}>
                        <span className="span-burger"></span>
                        <span className="span-burger double-span"></span>
                        <span className="span-burger double-span"></span>
                    </button>
                    <ul className={"nav-list " + classNav}>
                        <li><NavLink aria-label="btn-home" onClick={toggleBurger} to="/">Home</NavLink></li>
                        <li><NavLink aria-label="btn-recettes" onClick={toggleBurger} to="/recettes">Recettes</NavLink></li>
                        {!state.logUser &&
                            <li><NavLink aria-label="btn-loggin" to="/loggin">Connexion/Inscription</NavLink></li>
                        }
                    </ul>
                    <div className="settings">
                        <button aria-label="btn-engrenage" className="btn_settings" onClick={showList}></button>
                        <ul className={"NavSettings " + classParamNav}>
                            <li><button aria-label="btn-accessibilité" className="btn_access" onClick={showAccess}>Accessibilité</button></li>
                            {state.logUser &&
                                <Fragment>
                                    <li><NavLink aria-label="btn-suggestion" onClick={showList} to="/suggestionRecettes">Suggestion de recettes</NavLink></li>
                                    <li><NavLink aria-label="btn-deconnexion" onClick={showList} to="/deco">Deconnexion</NavLink></li>
                                </Fragment>
                            }
                            {state.logAdmin &&
                                <li><NavLink aria-label="btn-admin" onClick={showList} to="/admin">Administration</NavLink></li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
            {showAcces &&
                <Accessibilite />
            }
        </Fragment>
    )
}

export default Navbar