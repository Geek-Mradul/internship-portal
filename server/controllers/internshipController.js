// server/controllers/internshipController.js
const db = require('../db');

exports.createInternship = async (req, res) => {
    const { role, stipend, duration, requirements } = req.body;
    const userIdFromToken = req.user.id; // This is the user_id

    if (!role || !duration || !requirements) {
        return res.status(400).json({ error: 'Role, duration, and requirements are required' });
    }

    try {
        // --- FIX STARTS HERE ---
        // 1. Find the company's primary key using the user_id from the token
        const companyResult = await db.query(
            'SELECT id FROM companies WHERE user_id = $1',
            [userIdFromToken]
        );

        if (companyResult.rows.length === 0) {
            return res.status(404).json({ error: 'Company profile not found for this user.' });
        }

        const companyId = companyResult.rows[0].id; // This is the correct company_id

        // 2. Now, create the internship using the correct company_id
        const newInternship = await db.query(
            'INSERT INTO internships (company_id, role, stipend, duration, requirements) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [companyId, role, stipend, duration, requirements]
        );
        // --- FIX ENDS HERE ---

        res.status(201).json(newInternship.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error creating internship' });
    }
};