// server/routes/internshipRoutes.js
const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const auth = require('../middleware/auth');
const { isCompany } = require('../middleware/checkRole');

// POST /api/internships - Create a new internship (Protected, Company Only)
router.post('/', auth, isCompany, internshipController.createInternship);

// GET /api/internships - Get all internships (Public)
router.get('/', internshipController.getAllInternships);

// GET /api/internships/my-internships - Get internships for the logged-in company (Protected, Company Only)
router.get('/my-internships', auth, isCompany, internshipController.getMyInternships);

// GET /api/internships/:internshipId/applicants - Get applicants for an internship (Protected, Company Only)
router.get('/:internshipId/applicants', auth, isCompany, internshipController.getApplicantsForInternship);


module.exports = router;