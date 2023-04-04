import React,{useContext} from 'react';
import axios from "axios"
import {BASE_URL} from '../config_front/API.js'
import {ReducerContext } from "../reducer/reducer"
import {inputLengthUp, inputLengthDown} from '../config_front/inputLengthFront.js'
import { useNavigate } from "react-router-dom";
import { LOGIN, ADMIN } from '../config_front/constante'

function Connect() {
    
    const [state, dispatch] = useContext(ReducerContext)
    
    const [email, setEmail] = React.useState("");
    const [mdp, setMdp] = React.useState("");
    // useState pour les inputs
    
    const [styleMdp, setStyleMdp] = React.useState("")
    const [styleEmail, setStyleEmail] = React.useState("")
    const [errForm, setErrForm] =React.useState(false)
    
    const [msgErreur, setMsgErreur] = React.useState("")
    
    const [disabledBtn, setDisabledBtn] = React.useState(true);
    const [showMDP, setShowMDP] = React.useState(false)
    const [typeMDP, setTypeMDP] = React.useState("password")
    // useState pour la mise-en-page/sécuritée
    
    const navigate = useNavigate();
    
    React.useEffect(() => {
        
        if(inputLengthUp(email) && inputLengthUp(mdp) && inputLengthDown(email) && inputLengthDown(mdp)){
            setDisabledBtn(false)
        } else {
            setDisabledBtn(true)
        }
    }, [email, mdp]);
    
    const show = (e) => {
        e.preventDefault()
        if (showMDP === true) {
            setTypeMDP("password")
            setShowMDP(false)
        } else {
            setTypeMDP("text")
            setShowMDP(true)
        }
    }
    
    const saveSub = (e) => {
        e.preventDefault();
        
        axios.post(`${BASE_URL}/connect`,{
            email,
            mdp
        })
        .then((res) => {
            
            if (res.data.response) {
                if (res.data.admin) {
                    
                    dispatch({type:ADMIN, payload:res.data.infoUser}) // ici je sauvegarde la connection des admins dans le reducer
                    localStorage.setItem('jwtToken', res.data.token)
                    axios.defaults.headers.common['Authorization'] = 'Bearer '+ res.data.token
                
                } else if (!res.data.admin) {
                    
                    dispatch({type:LOGIN, payload:res.data.infoUser}) // ici je sauvegarde la connection des users dans le reducer
                    localStorage.setItem('jwtToken', res.data.token)
                    axios.defaults.headers.common['Authorization'] = 'Bearer '+ res.data.token
                
                }
                navigate("/")
                
            } else {
                setMsgErreur(res.data.message)
                setStyleEmail("erreur")
                setErrForm(true)
                setStyleMdp("erreur")
            }
        })
        .catch((err) => {
            console.log(err)
        })           
        
    }
    
    const shutPopUp = (e) => {
        e.preventDefault()
        setErrForm(false)
    }
    
    return (
        <section className="log-wrapp">
            <form className="container log-form" onSubmit={saveSub}>
                <h2 className="log-title">Connexion</h2>
                <div className="log-input-wrapp">
                    {errForm &&
                        <div className='popUpErreur popUP-connect'>
                            <p className="popUp-msg">{msgErreur}</p>
                            <button aria-label="btn-off-popUp" onClick={shutPopUp}>OK</button>
                        </div>
                    }
                    <input className={'input-log ' + styleEmail} name="email" maxLength="63" type="email" value={email} placeholder="Adresse Email" onChange={(e) => setEmail(e.target.value)} required />
                    <input className={'input-log ' + styleMdp} name="mdp" maxLength="63" type={typeMDP} value={mdp} placeholder="Mot de passe" onChange={(e) => setMdp(e.target.value)} required />
                </div>
                <button aria-label="btn-show-mdp" className="showMDP" onClick={show}>Afficher/Cacher le mot de passe</button>
                {disabledBtn ? <input className="log-sub-disabled" type='submit' value="se connecter" disabled />
                            : <input className="log-sub" type="submit" value="se connecter"/>
                } 
                {/**fonction ternaire pour afficher ou non le boutton pour submit**/}
            </form>
        </section>
    )
}

export default Connect