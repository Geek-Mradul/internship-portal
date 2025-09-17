// client/src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast'; // <-- Import toast

const StudentDashboard = () => {
    const [internships, setInternships] = useState([]);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await api.get('/internships');
                setInternships(response.data);
            } catch (error) {
                console.error("Failed to fetch internships", error);
                toast.error('Failed to load internships.');
            }
        };
        fetchInternships();
    }, []);

    const handleApply = async (internshipId) => {
        const toastId = toast.loading('Submitting application...');
        try {
            const token = localStorage.getItem('token');
            // This API call will now work after we build the backend in the next step
            await api.post(`/apply/${internshipId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Applied successfully!', { id: toastId });
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to apply.';
            toast.error(errorMessage, { id: toastId });
        }
    };

    return (
        <div>
            <h2>Student Dashboard</h2>
            <h3>Available Internships</h3>
            {internships.length > 0 ? (
                internships.map(internship => (
                    <div key={internship.id} className="internship-card">
                        <h4>{internship.role} at {internship.company_name}</h4>
                        <p><strong>Stipend:</strong> {internship.stipend || 'N/A'}</p>
                        <p><strong>Duration:</strong> {internship.duration}</p>
                        <button onClick={() => handleApply(internship.id)}>Apply</button>
                    </div>
                ))
            ) : (
                <p>No internships available at the moment.</p>
            )}
        </div>
    );
};

export default StudentDashboard;