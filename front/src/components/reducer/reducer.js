import React from "react"

export const initialState = {
    logUser: false,
    logAdmin: false,
    userInfo: {id:"", prenom:""}
}

export const reducer = (state, action) => {
    switch(action.type){
        case 'ConnectUser': {
            return {...state, logUser:true, userInfo:action.payload}
        }
        case 'ConnectAdmin': {
            return {...state, logAdmin:true, logUser:true, userInfo:action.payload}
        }
        case 'Deconnection': {
            return {...state, logAdmin:false, logUser:false, userInfo:{id:"", prenom:""}}
        }
        default: 
            return state 
    }
}


export const ReducerContext = React.createContext([])

