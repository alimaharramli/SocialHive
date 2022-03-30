import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import {useAuth, errorMessage} from "../contexts/AuthContext"
import { Link, Navigate } from "react-router-dom"



export default function Register() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const {register,logout} = useAuth()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e){
        e.preventDefault()
        // Check password and its confirmation matches
        if( passwordRef.current.value !== passwordConfirmRef.current.value ){
            return setError('Passwords do not match')
        }
    
        setLoading(true) // Page is in loading mode until process is handled
        // Register new user
        await register(emailRef.current.value, passwordRef.current.value).then(function(value){
            localStorage.setItem("VerifyMail","You have registered successfully. Check your email for verification link")
            setError('')
            value.user.sendEmailVerification() // Send Email Verification
            logout()
        }).catch(function(error) {
            // Get error message
            var errorCode = error.code;
            console.log(errorCode)     
            setError(errorMessage(errorCode))
            setSuccess('')
        })

        console.log(error)
        setLoading(false) // Process is finished. Page is back to the normal state
    }
    const [redirectNow, setRedirectNow] = useState(false);
    return (
        // HTML page
        <>
            <Card className="mt-2">  
                <Card.Body style={{'backgroundColor': '#e9ecef'}}>
                    <h2 className="text-center mb-4">Register</h2>
                    {success && <Alert variant="success">{success}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && setTimeout(() => setRedirectNow(true), 1500) && redirectNow && <Navigate to="/login" />}
                    {/* {redirectNow && <Navigate to="/login" />} */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required/>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required/>
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required/>
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-4" type="submit">Register</Button>
                    </Form>
                </Card.Body>
            </Card>
        
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/login">Log In</Link>
            </div>
        </>
    )
}
