import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import {useAuth,errorMessage} from "../contexts/AuthContext"
import { Link } from "react-router-dom"


export default function UpdateProfile() {
    const emailRef = useRef()
    const curPasswordRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const formRef = useRef()
    const {currentUser,checkPassword,updatePassword,updateEmail} = useAuth()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    async function handleSubmit(e){
        e.preventDefault()

        
        // Check if password and its confirmation is identical
        if( passwordRef.current.value !== passwordConfirmRef.current.value ){
            return setError('Passwords do not match')
        }

        setLoading(true) // Page is in loading mode until process is handled

        // Update password
        await checkPassword(curPasswordRef.current.value).then(function(value){
            setSuccess("Profile Updated")
            setError('')
            if(passwordRef.current.value){
                // getting error messages
                updatePassword(passwordRef.current.value).catch(function(error){
                    var errorCode = error.code;
                    console.log(errorCode)     
                    setError(errorMessage(errorCode))
                    setSuccess('')
                    return
                })
            }
            //Update email
            if(emailRef.current.value !== emailRef.current.placeholder){
                updateEmail(emailRef.current.value).then(function(event){
                    setSuccess("Verification email sent!")
                    setError('')
                }).catch(function(error){
                    var errorCode = error.code;
                    console.log(errorCode)     
                    setError(errorMessage(errorCode))
                    setSuccess('')
                    return
                })
            }
            formRef.current.reset() // Reset Form
        }).catch(function(error) {
            var errorCode = error.code;
            console.log(errorCode)     
            setError(errorMessage(errorCode))
            setSuccess('')
        })
        
        setLoading(false) // Process is finished. Page is back to the normal state
    }
// HTML page of Update Profile Page
    return (
        <>
            <Card className="mt-2">  
                <Card.Body style={{'backgroundColor': '#e9ecef'}}>
                    <h2 className="text-center mb-4">Update Profile</h2>
                    {success && <Alert variant="success">{success}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit} ref={formRef}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email}/>
                        </Form.Group>
                        <Form.Group id="cur-password">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control type="password" ref={curPasswordRef} required/>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep the same"/>
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same"/>
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-4" type="submit">Submit</Button>
                    </Form>
                </Card.Body>
            </Card>
        
            <div className="w-100 text-center mt-2">
                <Link to="/">Go back</Link>
            </div>
        </>
    )
}
