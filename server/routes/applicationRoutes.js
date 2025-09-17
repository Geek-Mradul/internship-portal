// server/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');
const { isStudent } = require('../middleware/checkRole');

// POST /api/apply/:internshipId
router.post('/:internshipId', auth, isStudent, applicationController.createApplication);

module.exports = router;