import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import {useAuth,errorMessage} from "../contexts/AuthContext"
import { Link } from "react-router-dom"


// Password Recovery for users who cant remember their password
export default function ForgotPassword() {
    const emailRef = useRef()
    const {resetPassword} = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    

    async function handleSubmit(e){
        e.preventDefault()

        setLoading(true) // Page is in loading mode until process is handled
        await resetPassword(emailRef.current.value).then(function(value){
            setMessage('Check your email for further instructions')
            setError('')
        }).catch(function(error){
            // get error code
            var errorCode = error.code;
            console.log(errorCode)     
            setError(errorMessage(errorCode))
            setMessage('')
        })
        
        setLoading(false) // Process is finished. Page is back to the normal state
    }

    return (
        <div className="w-100 d-flex align-items-center justify-content-center">
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <Card className="mt-2">  
                    <Card.Body style={{'backgroundColor': '#e9ecef'}}>
                        <h2 className="text-center mb-4">Forgot Password</h2>
                        {message && <Alert variant="info">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required/>
                            </Form.Group>
                            <Button disabled={loading} className="w-100 mt-4" type="submit">Reset Password</Button>
                        </Form>
                        <div className="w-100 text-center mt-3">
                            <Link to="/login">Login</Link>
                        </div>
                    </Card.Body>
                </Card>
            
                <div className="w-100 text-center mt-2 color2">
                    You don't have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    )
}
