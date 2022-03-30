import React, {useState} from 'react'
import {Card,Button,Alert} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {useAuth, errorMessage} from "../contexts/AuthContext"
import {useNavigate} from "react-router-dom"
export default function Dashboard() {
    const {currentUser,logout} = useAuth()
    const [loading,setLoading] = useState()
    const [error, setError] = useState()
    const navigate = useNavigate()

    async function handleLogout(e){
        setLoading(true)
        logout().then(function(value){
            navigate("/login")
        }).catch(function(error){
            var errorCode = error.code
            console.log(errorCode)   
            setError(errorMessage(errorCode))
        })
        setLoading(false)
    }  

    return (
        <div>
            
            <Card className="mt-2">
                <Card.Header>
                    <h2>Welcome</h2>
                </Card.Header>
                <Card.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <h5>Email: {currentUser.email}</h5>
                        <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                            Update Profile
                        </Link>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Button disabled={loading} variant="link" onClick={handleLogout}>
                    Log Out
                </Button>
            </div>
        </div>
    )
}
