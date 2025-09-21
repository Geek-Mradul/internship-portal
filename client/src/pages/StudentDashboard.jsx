// client/src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import FileUpload from '../components/FileUpload.jsx';

const StudentDashboard = () => {
    const [internships, setInternships] = useState([]);
    const [studentProfile, setStudentProfile] = useState(null);
    const [appliedInternships, setAppliedInternships] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [
                internshipsResponse,
                profileResponse,
                appliedResponse
            ] = await Promise.all([
                api.get('/internships'),
                api.get('/student/profile', { headers }),
                api.get('/apply/my-applications', { headers })
            ]);

            setInternships(internshipsResponse.data);
            setStudentProfile(profileResponse.data);
            setAppliedInternships(appliedResponse.data);

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
            toast.error('Could not load all dashboard data.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApply = async (internshipId) => {
        const toastId = toast.loading('Submitting application...');
        try {
            const token = localStorage.getItem('token');
            await api.post(`/apply/${internshipId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Applied successfully!', { id: toastId });
            fetchData(); // Refetch all data to update the UI
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to apply.';
            toast.error(errorMessage, { id: toastId });
        }
    };

    const onResumeUploadSuccess = () => {
        toast.success('Profile updated!');
        setIsUploading(false);
        fetchData(); // Refetch all data
    };

    const handleUpdateAllApplications = async () => {
        const toastId = toast.loading('Updating all past applications...');
        try {
            const token = localStorage.getItem('token');
            const response = await api.put('/apply/update-resume', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`${response.data.updatedCount} application(s) updated!`, { id: toastId });
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to update applications.';
            toast.error(errorMessage, { id: toastId });
        }
    };

    // This function is no longer used by a button but is kept for completeness
    const handleUpdateSingleApplication = async (applicationId) => {
        const toastId = toast.loading('Updating application...');
        try {
            const token = localStorage.getItem('token');
            await api.put(`/apply/${applicationId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Application updated!', { id: toastId });
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to update application.';
            toast.error(errorMessage, { id: toastId });
        }
    };

    const appliedInternshipIds = new Set(appliedInternships.map(i => i.id));

    return (
        <div>
            <h2>Student Dashboard</h2>
            <div className="dashboard-layout">
                {/* --- MAIN CONTENT (LEFT COLUMN) --- */}
                <main>
                    <h3>Available Internships</h3>
                    {internships.length > 0 ? (
                        internships.map(internship => (
                            <div key={internship.id} className="internship-card">
                                <h4>{internship.role} at {internship.company_name}</h4>
                                <p><strong>Stipend:</strong> {internship.stipend || 'N/A'}</p>
                                <p><strong>Duration:</strong> {internship.duration}</p>

                                {appliedInternshipIds.has(internship.id) ? (
                                    <div className="button-inline-group">
                                        <button disabled>Applied</button>
                                        <button onClick={handleUpdateAllApplications} className="update-btn-small">
                                            Update Resume
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => handleApply(internship.id)}>
                                        Apply
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No internships available at the moment.</p>
                    )}
                </main>

                {/* --- SIDEBAR (RIGHT COLUMN) --- */}
                <aside>
                    <div className="internship-card">
                        <h4>Application Status</h4>
                        {studentProfile && studentProfile.resume_url && !isUploading ? (
                            <div>
                                <p style={{ color: 'green' }}>✅ Resume on file.</p>
                                <div className="button-group">
                                    <a href={studentProfile.resume_url} target="_blank" rel="noopener noreferrer">View Resume</a>
                                    <button onClick={() => setIsUploading(true)}>Change Resume</button>
                                    <button onClick={handleUpdateAllApplications}>Update All</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {!studentProfile?.resume_url && <p style={{ color: 'red' }}>⚠️ Resume not found.</p>}
                                <FileUpload onUploadSuccess={onResumeUploadSuccess} />
                                {studentProfile?.resume_url && <button onClick={() => setIsUploading(false)}>Cancel</button>}
                            </div>
                        )}
                    </div>

                    <div className="internship-card">
                        <h4>Applied Internships</h4>
                        {appliedInternships.length > 0 ? (
                            <ul>
                                {appliedInternships.map(app => (
                                    <li key={app.applicationId}>
                                        {/* The update button is now removed from here */}
                                        <span>{app.role}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>You haven't applied to any internships yet.</p>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default StudentDashboard;