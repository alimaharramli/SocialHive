import React from "react"
import Register from "./Register"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Card,Container } from "react-bootstrap"
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from './PrivateRoute'
import ForgotPassword from './ForgotPassword'
import UpdateProfile from "./UpdateProfile"
import ChatRoom from "./ChatRoom"

function App() {
  return (
    //Main Container of Application
      <div 
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
        >
        <div className="w-100">
          <Router>
            <AuthProvider>
              <Routes>
                <Route exact path="/" element={<PrivateRoute user={1} redir="/login"> <Dashboard/></PrivateRoute>}/>
                <Route path="/update-profile" element={<PrivateRoute user={1} redir="/login"> <UpdateProfile/></PrivateRoute>}/>
                <Route path="/chat-room" element={<PrivateRoute user={1} redir="/chat-room"> <ChatRoom/></PrivateRoute>}/>
                
                <Route path="/register" element={<PrivateRoute user={0} redir="/"><Register/></PrivateRoute>} />
                <Route path="/login" element={<PrivateRoute user={0} redir="/"> <Login/></PrivateRoute>} />
                <Route path="/forgot-password" element={<PrivateRoute user={0} redir="/"> <ForgotPassword/></PrivateRoute>}/>
                <Route path="*" element={
                    <Card className="mt-2">  
                      <Card.Header>
                        SocialHive
                      </Card.Header>
                      <Card.Body style={{'backgroundColor': '#e9ecef'}}>
                        <h3 className="text-center mb-4">There's nothing here: 404!</h3>
                        <h4 className="text-center mb-4">The requested URL {window.location.pathname} was not found on this server.</h4>
                      </Card.Body>
                    </Card>
                  }/>
              </Routes>
            </AuthProvider>
          </Router>
        </div>
      </div>
  )
}

export default App;
