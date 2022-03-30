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
    const [curemail, setCurrentEmail] = useState(currentUser.email)
    async function handleSubmit(e){
        e.preventDefault()

        
        
        if( passwordRef.current.value !== passwordConfirmRef.current.value ){
            return setError('Passwords do not match')
        }

        setLoading(true)

        await checkPassword(curPasswordRef.current.value).then(function(value){
            setSuccess("Profile Updated")
            setError('')
            if(passwordRef.current.value){
                updatePassword(passwordRef.current.value).catch(function(error){
                    var errorCode = error.code;
                    console.log(errorCode)     
                    setError(errorMessage(errorCode))
                    setSuccess('')
                    return
                })
            }
            if(emailRef.current.value !== emailRef.current.placeholder){
                updateEmail(emailRef.current.value).catch(function(error){
                    var errorCode = error.code;
                    console.log(errorCode)     
                    setError(errorMessage(errorCode))
                    setSuccess('')
                    return
                })
            }
            setCurrentEmail(emailRef.current.value)
            formRef.current.reset()
        }).catch(function(error) {
            var errorCode = error.code;
            console.log(errorCode)     
            setError(errorMessage(errorCode))
            setSuccess('')
        })
        
        setLoading(false)
    }

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
                            <Form.Control type="email" ref={emailRef} required defaultValue={curemail}/>
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
