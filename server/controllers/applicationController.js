// server/controllers/applicationController.js
const db = require('../db');

exports.createApplication = async (req, res) => {
    const { internshipId } = req.params;
    const userIdFromToken = req.user.id;

    try {
        // 1. Get the student's ID and resume URL using their user_id
        const studentResult = await db.query(
            'SELECT id, resume_url FROM students WHERE user_id = $1',
            [userIdFromToken]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Student profile not found.' });
        }

        const student = studentResult.rows[0];
        if (!student.resume_url) {
            return res.status(400).json({ error: 'Please upload a resume before applying.' });
        }

        // 2. Insert the application into the database
        await db.query(
            'INSERT INTO applications (internship_id, student_id, resume_url_used) VALUES ($1, $2, $3)',
            [internshipId, student.id, student.resume_url]
        );

        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        // Handle cases where a student tries to apply for the same job twice
        if (error.code === '23505') { // Unique violation error code
            return res.status(400).json({ error: 'You have already applied for this internship.' });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error while submitting application.' });
    }
};