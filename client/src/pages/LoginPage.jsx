// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import toast from 'react-hot-toast'; // <-- Import toast

const LoginPage = () => {
    // ... (keep the useState and handleChange functions)
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Logging in...'); // Optional: show a loading toast
        try {
            const response = await api.post('/auth/login', formData);
            const token = response.data.token;
            localStorage.setItem('token', token);

            toast.success('Login successful!', { id: toastId }); // Replace alert

            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;

            if (userRole === 'company') {
                navigate('/company/dashboard');
            } else if (userRole === 'student') {
                navigate('/student/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
            toast.error(errorMessage, { id: toastId }); // Replace alert
        }
    };

    // ... (keep the return(...) JSX)
    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginPage;