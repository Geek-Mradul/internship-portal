// server/controllers/studentController.js
const db = require('../db');

exports.getStudentProfile = async (req, res) => {
    try {
        const studentResult = await db.query(
            'SELECT * FROM students WHERE user_id = $1',
            [req.user.id] // user_id comes from the auth token
        );
        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Student profile not found.' });
        }
        res.status(200).json(studentResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching student profile.' });
    }
};