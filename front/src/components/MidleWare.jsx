import {useContext, useEffect, Fragment, useState} from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ReducerContext } from "./reducer/reducer.js";
import { userPath, adminPath } from './config_front/path.js'

const Middleware = ({children}) => {
    const [state, dispatch] = useContext(ReducerContext)
    const [show, setShow] = useState(false)
    const navigate = useNavigate();

    const location = useLocation()
    const currentPath = location.pathname

    useEffect(() => {
        if(userPath.includes(currentPath)){
            if(!state.logUser){
                navigate('/')
            }
        }
        setShow(true)

        if(adminPath.includes(currentPath)){
            if(!state.logAdmin){
                navigate('/')
            }
        }
    }, [currentPath]);

    return(
        <Fragment>
            {children}
        </Fragment>
    )
}

export default Middleware
