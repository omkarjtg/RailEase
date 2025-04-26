import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // Redirect to home page or a login page
  }

  return element; 
}

export default ProtectedRoute;
