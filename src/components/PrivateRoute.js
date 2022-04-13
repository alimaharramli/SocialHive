import React from 'react'
import {Route, Navigate} from 'react-router-dom'
import {useAuth} from '../contexts/AuthContext'
export default function PrivateRoute({user, redir, children}) {
    const {currentUser} = useAuth()
    var val = 0
    if(currentUser) val = user
    else val = !user
    return (val ? children : <Navigate to={redir}/>)
    
}