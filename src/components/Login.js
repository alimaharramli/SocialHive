import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import {useAuth,errorMessage} from "../contexts/AuthContext"
import { Link, Navigate } from "react-router-dom"

// Login
export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const {login,logout} = useAuth()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    // Handle Submit Process
    async function handleSubmit(e){
        e.preventDefault()
        localStorage.removeItem("VerifyError")
        localStorage.removeItem("VerifyMail")
        
        setLoading(true)  // Page is in loading mode until process is handled

        await login(emailRef.current.value, passwordRef.current.value).then(function(value){
            // Check if email is verified 
            if(value.user.emailVerified){
                setSuccess("You have logged in successfully")
                setError('')
            }else{
                localStorage.setItem("VerifyError","You haven't verified your email yet.")
                setSuccess('')
                logout()
            }
        }).catch(function(error) {
            // get error message
            var errorCode = error.code;
            console.log(errorCode)     
            setError(errorMessage(errorCode))
            setSuccess('')
        })
        
        setLoading(false) // Process is finished. Page is back to the normal state
    }

    const [redirectNow, setRedirectNow] = useState(false);


    return (
        <>
            <Card className="mt-2">  
                <Card.Body style={{'backgroundColor': '#e9ecef'}}>
                    <h2 className="text-center mb-4">Log In</h2>
                    {success && <Alert variant="success">{success}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {localStorage.getItem("VerifyError")&&<Alert variant="danger">{localStorage.getItem("VerifyError")}</Alert>}
                    {localStorage.getItem("VerifyMail")&&<Alert variant="info">{localStorage.getItem("VerifyMail")}</Alert>}
                    
                    {success && setTimeout(() => setRedirectNow(true), 1500) && redirectNow && <Navigate to="/" />}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required/>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required/>
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-4" type="submit">Log In</Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/forgot-password">Forgot Password</Link>
                    </div>
                </Card.Body>
            </Card>
        
            <div className="w-100 text-center mt-2">
                You don't have an account? <Link to="/register">Register</Link>
            </div>
        </>
    )
}
