// server/controllers/applicationController.js
const db = require('../db');

exports.createApplication = async (req, res) => {
    const { internshipId } = req.params;
    const userIdFromToken = req.user.id;

    try {
        // 1. Get the student's ID and resume_url from the 'students' table
        const studentResult = await db.query(
            'SELECT id, resume_url FROM students WHERE user_id = $1',
            [userIdFromToken]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Student profile not found.' });
        }

        const student = studentResult.rows[0];
        // 2. Check if the resume_url from the student's profile exists
        if (!student.resume_url) {
            return res.status(400).json({ error: 'Please upload a resume before applying.' });
        }

        // 3. Insert into the 'applications' table using the correct column name 'resume_url_used'
        await db.query(
            'INSERT INTO applications (internship_id, student_id, resume_url_used) VALUES ($1, $2, $3)',
            [internshipId, student.id, student.resume_url]
        );

        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'You have already applied for this internship.' });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error while submitting application.' });
    }
};
exports.getAppliedInternships = async (req, res) => {
    try {
        const studentResult = await db.query('SELECT id FROM students WHERE user_id = $1', [req.user.id]);
        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Student profile not found.' });
        }
        const studentId = studentResult.rows[0].id;

        const result = await db.query(
            `SELECT 
         i.id, -- This is the internship ID, which we need for the check
         a.id as "applicationId", -- This is the unique application ID
         i.role, 
         c.company_name 
       FROM applications a
       JOIN internships i ON a.internship_id = i.id
       JOIN companies c ON i.company_id = c.id
       WHERE a.student_id = $1`,
            [studentId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching applied internships.' });
    }
};
exports.updateResumeInApplications = async (req, res) => {
    const userIdFromToken = req.user.id;

    try {
        // 1. Get the student's ID and their NEW resume URL from their profile
        const studentResult = await db.query(
            'SELECT id, resume_url FROM students WHERE user_id = $1',
            [userIdFromToken]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Student profile not found.' });
        }

        const studentId = studentResult.rows[0].id;
        const newResumeUrl = studentResult.rows[0].resume_url;

        if (!newResumeUrl) {
            return res.status(400).json({ error: 'No new resume found on profile to update.' });
        }

        // 2. Update all applications for this student with the new resume URL
        const updateResult = await db.query(
            'UPDATE applications SET resume_url_used = $1 WHERE student_id = $2',
            [newResumeUrl, studentId]
        );

        res.status(200).json({
            message: 'Applications updated successfully.',
            updatedCount: updateResult.rowCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while updating applications.' });
    }
};
exports.updateSingleApplication = async (req, res) => {
    const { applicationId } = req.params;
    const userIdFromToken = req.user.id;

    try {
        // 1. Get student's ID and new resume URL from their profile
        const studentResult = await db.query(
            'SELECT id, resume_url FROM students WHERE user_id = $1',
            [userIdFromToken]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Student profile not found.' });
        }
        const studentId = studentResult.rows[0].id;
        const newResumeUrl = studentResult.rows[0].resume_url;

        if (!newResumeUrl) {
            return res.status(400).json({ error: 'No new resume found on profile.' });
        }

        // 2. Update a SINGLE application, ensuring it belongs to the logged-in student
        const updateResult = await db.query(
            'UPDATE applications SET resume_url_used = $1 WHERE id = $2 AND student_id = $3',
            [newResumeUrl, applicationId, studentId]
        );

        // Check if any row was actually updated
        if (updateResult.rowCount === 0) {
            return res.status(404).json({ error: 'Application not found or you do not have permission to update it.' });
        }

        res.status(200).json({ message: 'Application updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while updating application.' });
    }
};