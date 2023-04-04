import React from "react"
import {initialState, reducer, ReducerContext} from "./reducer/reducer"

const Provider = ({children}) => {
    const [state, dispatch] = React.useReducer(reducer, initialState)
    
    return(
        <ReducerContext.Provider value={[state, dispatch]}>
            {children}
        </ReducerContext.Provider>
    )
    
    
}

export default Provider