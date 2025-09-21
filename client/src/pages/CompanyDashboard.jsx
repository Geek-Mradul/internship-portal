// client/src/pages/CompanyDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal.jsx';

const CompanyDashboard = () => {
    // State for the new internship form
    const [formData, setFormData] = useState({ role: '', stipend: '', duration: '', requirements: '' });

    // State for managing data
    const [myInternships, setMyInternships] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [selectedInternship, setSelectedInternship] = useState(null);

    // State for the modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- DATA FETCHING ---
    const fetchMyInternships = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/internships/my-internships', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyInternships(response.data);
        } catch (error) {
            toast.error('Could not fetch your internships.');
        }
    };

    useEffect(() => {
        fetchMyInternships();
    }, []);

    // --- EVENT HANDLERS ---
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
            setFormData({ role: '', stipend: '', duration: '', requirements: '' });
            e.target.reset();
            fetchMyInternships(); // Refresh the list after posting
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to post internship.';
            toast.error(errorMessage, { id: toastId });
        }
    };

    const viewApplicants = async (internship) => {
        setSelectedInternship(internship);
        setApplicants([]);
        const toastId = toast.loading('Fetching applicants...');
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/internships/${internship.id}/applicants`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplicants(response.data);
            setIsModalOpen(true); // Open the modal
            toast.success('Applicants loaded', { id: toastId });
        } catch (error) {
            toast.error('Could not fetch applicants.', { id: toastId });
        }
    };

    // --- RENDER METHOD ---
    return (
        <div>
            <h2>Company Dashboard</h2>
            <div className="dashboard-layout">

                {/* --- SIDEBAR (LEFT COLUMN) --- */}
                <aside>
                    <div className="internship-card">
                        <h3>Post a New Internship</h3>
                        <form onSubmit={handleSubmit}>
                            <input name="role" placeholder="Role" value={formData.role} onChange={handleChange} required />
                            <input name="stipend" placeholder="Stipend" value={formData.stipend} onChange={handleChange} />
                            <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} required />
                            <textarea name="requirements" placeholder="Requirements" value={formData.requirements} onChange={handleChange} required />
                            <button type="submit">Post Internship</button>
                        </form>
                    </div>
                </aside>

                {/* --- MAIN CONTENT (RIGHT COLUMN) --- */}
                <main>
                    <h3>Your Posted Internships</h3>
                    {myInternships.length > 0 ? (
                        myInternships.map(internship => (
                            <div key={internship.id} className="internship-card">
                                <h4>{internship.role}</h4>
                                <p><strong>Duration:</strong> {internship.duration}</p>
                                <button onClick={() => viewApplicants(internship)}>View Applicants</button>
                            </div>
                        ))
                    ) : (
                        <p>You have not posted any internships yet.</p>
                    )}
                </main>
            </div>

            {/* --- APPLICANTS MODAL (doesn't affect layout) --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedInternship && (
                    <div>
                        <h3>Applicants for "{selectedInternship.role}"</h3>
                        {applicants.length > 0 ? (
                            applicants.map(applicant => (
                                <div key={applicant.email} className="internship-card">
                                    <p><strong>Name:</strong> {applicant.full_name}</p>
                                    <p><strong>Email:</strong> {applicant.email}</p>
                                    <a href={applicant.resume_url_used} target="_blank" rel="noopener noreferrer">View Resume</a>
                                </div>
                            ))
                        ) : (
                            <p>No applications received yet for this position.</p>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CompanyDashboard;