// client/src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast'; // <-- Import toast

const SignupPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student',
        fullName: '',
        companyName: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Creating your account...');
        try {
            // Create a payload with only the necessary fields
            const payload = {
                email: formData.email,
                password: formData.password,
                role: formData.role,
            };
            if (formData.role === 'student') {
                payload.fullName = formData.fullName;
            } else {
                payload.companyName = formData.companyName;
            }

            await api.post('/auth/signup', payload);
            toast.success('Signup successful! Please log in.', { id: toastId });
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Signup failed. Please try again.';
            toast.error(errorMessage, { id: toastId });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <select name="role" onChange={handleChange} value={formData.role}>
                <option value="student">Student</option>
                <option value="company">Company</option>
            </select>
            {formData.role === 'student' ? (
                <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
            ) : (
                <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} required />
            )}
            <button type="submit">Signup</button>
        </form>
    );
};

export default SignupPage;