import React from 'react';
import axios from "axios"
import {BASE_URL} from '../config_front/API.js'
import {inputLengthUp, inputLengthDown} from '../config_front/inputLengthFront.js'

function Register(props) {
    
    const [nom, setNom] = React.useState("");
    const [prenom, setPrenom] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [mdp, setMdp] = React.useState("");
    const [verifMDP, setVerifMDP] = React.useState("");
    // useState pour enregistrer les inputs
    
    
    const [styleMdp, setStyleMdp] = React.useState("")
    const [errMdp, setErrMdp] = React.useState(false)
    
    const [styleVerifMdp, setStyleVerifMdp] = React.useState("")
    const [errVerifMdp, setErrVerifMdp] = React.useState(false)
    
    const [msgErreur, setMsgErreur] = React.useState("")
    const [statutErr, setStatutErr] = React.useState(0)
    const [count, setCount] = React.useState(0)
    
    const [disabledBtn, setDisabledBtn] = React.useState(true);
    const [showMDP, setShowMDP] = React.useState(false)
    const [typeMDP, setTypeMDP] = React.useState("password")
    // useState pour la mise-en-page/sécuritée
    
    React.useEffect(() => {
        
        if(inputLengthUp(email) && inputLengthUp(mdp) && inputLengthUp(verifMDP) && inputLengthDown(email) && inputLengthDown(mdp) && inputLengthDown(verifMDP)){
            setDisabledBtn(false)
        } else {
            setDisabledBtn(true)
        }
    }, [email, mdp, verifMDP]);
    
    React.useEffect(() => {
        
        if (statutErr === 1) {
            
            setStyleVerifMdp("erreur")
            setErrVerifMdp(true)
            
        } else if (statutErr === 2) {
            
            setStyleMdp("erreur")
            setErrMdp(true)
            
        } else if (statutErr === 3) {
            
            setStyleMdp("erreur")
            setErrMdp(true)
        }
        
    }, [statutErr, msgErreur, count]);
    
    const shutPopUp = (e) => {
        e.preventDefault()
        setErrMdp(false)
        setErrVerifMdp(false)
    }
    
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
        
        axios.post(`${BASE_URL}/register`,{
            nom,
            prenom,
            email,
            mdp,
            verifMDP
        })
        .then((res) => {
            if (res.data.response === true) {
                setNom("")
                setPrenom("")
                setEmail("")
                setMdp("")
                setVerifMDP("")
                props.callBack()
            } else {
                
                setMsgErreur(res.data.message)
                setStatutErr(res.data.statutErr)
                setCount(count+1)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
    
    return (
        <section className="log-wrapp">
            <form className="container log-form" onSubmit={saveSub}>
                <h2 className="log-title">Inscription</h2>
                <div className="log-input-wrapp">
                    <input className='input-log' type="text" maxLength="63" value={nom} placeholder="Nom" onChange={(e) => setNom(e.target.value)} required />
                    <input className='input-log' type="text" maxLength="63" value={prenom} placeholder="Prénom" onChange={(e) => setPrenom(e.target.value)} required />
                    <input className='input-log' type="email" maxLength="63" value={email} placeholder="Adresse Email" onChange={(e) => setEmail(e.target.value)} required />
                    {errMdp === true &&
                        <div className='popUpErreur popUP-mdp'>
                            <p className="popUp-msg">{msgErreur}</p>
                            <button aria-label="btn-off-popUp" onClick={shutPopUp}>OK</button>
                        </div>
                    }
                    <input className={'input-log ' + styleMdp} type={typeMDP} maxLength="63" value={mdp} placeholder="Mot de passe" onChange={(e) => setMdp(e.target.value)} required />
                    {errVerifMdp === true &&
                        <div className='popUpErreur popUP-verifMdp'>
                            <p className="popUp-msg">{msgErreur}</p>
                            <button onClick={shutPopUp}>OK</button>
                        </div>
                    }
                    <input className={'input-log ' + styleVerifMdp} type={typeMDP} maxLength="63" value={verifMDP} placeholder="Confirmez le mot de passe" onChange={(e) => setVerifMDP(e.target.value)} required />
                    
                </div>
                <button aria-label="btn-sow-mdp" className="showMDP" onClick={show}>Afficher/Cacher le mot de passe</button>
                {disabledBtn===true ? <input className="log-sub-disabled" type='submit' value="s'inscrire" disabled /> : <input className="log-sub" type="submit" value="s'inscrire"/>} 
                {/**fonction ternaire pour afficher ou non le boutton pour submit**/}
            </form>
        </section>
    )
}

export default Register