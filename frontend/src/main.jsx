import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './AuthContext';
ReactDOM.createRoot(document.getElementById('root')).render(
 
 <Router>
    <AuthProvider>
    <GoogleOAuthProvider clientId="479517111297-3h7r1pfo8tbeqt4213febp45pu9hi9jl.apps.googleusercontent.com">
      <App />
      </GoogleOAuthProvider>
      </AuthProvider>
  </Router>
)
