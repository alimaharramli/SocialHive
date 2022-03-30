import React, { useContext,useState,useEffect } from 'react'
import {auth,authlib, error_codes} from "../firebase"
const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function errorMessage(code){
    return  error_codes[code]
}

export function AuthProvider( { children } ) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    function register(email,password){
        return auth.createUserWithEmailAndPassword(email,password)
    }

    function login(email,password){
        return auth.signInWithEmailAndPassword(email,password)
    }
    
    function logout(){
        return auth.signOut()
    }

    function resetPassword(email){
        return auth.sendPasswordResetEmail(email)
    }

    function checkPassword(password){
        const credential = authlib.EmailAuthProvider.credential(currentUser.email,password)
        return currentUser.reauthenticateWithCredential(credential)
    }

    function updateEmail(email){
        return currentUser.updateEmail(email)
    }
    
    function updatePassword(password){
        return currentUser.updatePassword(password)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged( user => {
                setCurrentUser(user)
                setLoading(false)
        })  

        return unsubscribe
    },[])

    const value = {
        currentUser,
        login,
        register,
        logout,
        resetPassword,
        checkPassword,
        updateEmail,
        updatePassword
    }

    return (
        <AuthContext.Provider value={value} >
            {!loading && children}
        </AuthContext.Provider>
    )
}
