// server/controllers/internshipController.js
const db = require('../db');

// POST /api/internships - Create a new internship (for companies)
exports.createInternship = async (req, res) => {
    const { role, stipend, duration, requirements } = req.body;
    const userIdFromToken = req.user.id;

    if (!role || !duration || !requirements) {
        return res.status(400).json({ error: 'Role, duration, and requirements are required' });
    }

    try {
        // 1. Find the company's primary key (id) using the user_id from the token
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

        res.status(201).json(newInternship.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error creating internship' });
    }
};

// GET /api/internships - Get all internships (for students/public)
exports.getAllInternships = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT i.id, i.role, i.stipend, i.duration, i.requirements, c.company_name 
       FROM internships i 
       JOIN companies c ON i.company_id = c.id
       ORDER BY i.created_at DESC`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching internships' });
    }
};

// GET /api/internships/my-internships - Get internships for the logged-in company
exports.getMyInternships = async (req, res) => {
    try {
        const companyResult = await db.query('SELECT id FROM companies WHERE user_id = $1', [req.user.id]);
        if (companyResult.rows.length === 0) {
            return res.status(404).json({ error: 'Company profile not found.' });
        }
        const companyId = companyResult.rows[0].id;

        const internships = await db.query('SELECT * FROM internships WHERE company_id = $1 ORDER BY created_at DESC', [companyId]);
        res.status(200).json(internships.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching company internships.' });
    }
};

// GET /api/internships/:internshipId/applicants - Get applicants for a specific internship (for companies)
exports.getApplicantsForInternship = async (req, res) => {
    const { internshipId } = req.params;

    try {
        // This query joins applications with student and user tables to get applicant details
        const applicants = await db.query(
            `SELECT u.email, s.full_name, a.resume_url_used 
       FROM applications a
       JOIN students s ON a.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE a.internship_id = $1`,
            [internshipId]
        );

        res.status(200).json(applicants.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching applicants.' });
    }
};