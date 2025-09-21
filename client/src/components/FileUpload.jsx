// client/src/components/FileUpload.jsx
import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file); // 'resume' is the key your backend expects

        const toastId = toast.loading('Uploading resume...');
        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/student/resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Resume uploaded successfully!', { id: toastId });
            if (onUploadSuccess) {
                onUploadSuccess(response.data.resumeUrl);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Upload failed.';
            toast.error(errorMessage, { id: toastId });
        }
    };

    return (
        <div className="file-upload">
            <h3>Upload Your Resume</h3>
            <p>Please upload a PDF or Word document to apply for internships.</p>
            <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
            <button onClick={handleUpload}>Upload and Save</button>
        </div>
    );
};

export default FileUpload;