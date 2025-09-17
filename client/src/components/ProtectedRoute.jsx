// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // 1. If no token, not logged in, redirect to login
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        // 2. Check if the user's role is in the list of allowed roles
        if (allowedRoles.includes(userRole)) {
            // 3. If role is allowed, show the page
            return children;
        } else {
            // 4. If role is not allowed, redirect to home page
            return <Navigate to="/" />;
        }
    } catch (error) {
        // If token is invalid or expired, redirect to login
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;