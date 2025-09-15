// server/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const auth = require('../middleware/auth');
const db = require('../db');

// This route will handle the resume upload and update the user's record
router.post('/resume', auth, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        // req.file.path contains the secure URL from Cloudinary
        const resumeUrl = req.file.path;
        const userId = req.user.id;

        // Update the resume_url in the students table
        await db.query('UPDATE students SET resume_url = $1 WHERE user_id = $2', [resumeUrl, userId]);

        res.status(200).json({ message: 'Resume uploaded successfully', resumeUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading file.' });
    }
});

module.exports = router;