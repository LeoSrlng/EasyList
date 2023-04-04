import {useState, useEffect, Fragment} from "react"
import Register from "./Register.jsx"
import Connect from "./Connect.jsx"

const Loggin = () => {
    const [showLoggin, setShowLoggin] = useState(false)
    const [label, setLabel] = useState("s'inscrire")
    
    const submit = (e) => {
        e.preventDefault()
        setShowLoggin((e) => !e)
    }
    
    useEffect(() => {
        showLoggin ? setLabel("s'inscrire") : setLabel("se connecter")
    },[showLoggin])
    
    return(
        <Fragment>
            <button aria-label="btn-controller-login" onClick={submit}>{label}</button>
            {showLoggin ? <Connect /> : <Register callBack={() => setShowLoggin((e) => !e)} />}
        </Fragment>
    )
}

export default Loggin