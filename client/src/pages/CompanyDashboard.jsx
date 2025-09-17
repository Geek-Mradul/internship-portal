// client/src/pages/CompanyDashboard.jsx
import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast'; // <-- Import toast

const CompanyDashboard = () => {
    const [formData, setFormData] = useState({
        role: '',
        stipend: '',
        duration: '',
        requirements: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Posting internship...');
        try {
            const token = localStorage.getItem('token');
            await api.post('/internships', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Internship posted successfully!', { id: toastId });
            // Optional: Clear form after successful submission
            setFormData({ role: '', stipend: '', duration: '', requirements: '' });
            e.target.reset(); // Also resets the form fields visually
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to post internship.';
            toast.error(errorMessage, { id: toastId });
        }
    };

    return (
        <div>
            <h2>Company Dashboard</h2>
            <h3>Post a New Internship</h3>
            <form onSubmit={handleSubmit}>
                <input name="role" placeholder="Role (e.g., Frontend Developer)" onChange={handleChange} required />
                <input name="stipend" placeholder="Stipend (e.g., ₹10,000/month)" onChange={handleChange} />
                <input name="duration" placeholder="Duration (e.g., 3 Months)" onChange={handleChange} required />
                <textarea name="requirements" placeholder="Requirements" onChange={handleChange} required />
                <button type="submit">Post Internship</button>
            </form>
            {/* You can add a list of posted internships here later */}
        </div>
    );
};

export default CompanyDashboard;