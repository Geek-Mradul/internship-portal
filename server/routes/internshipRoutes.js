// server/routes/internshipRoutes.js
const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const auth = require('../middleware/auth');
const { isCompany } = require('../middleware/checkRole');

// POST /api/internships - Create a new internship
router.post('/', auth, isCompany, internshipController.createInternship);

module.exports = router;