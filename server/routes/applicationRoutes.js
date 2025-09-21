// server/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');
const { isStudent } = require('../middleware/checkRole');

// POST /api/apply/:internshipId
router.post('/:internshipId', auth, isStudent, applicationController.createApplication);
router.get('/my-applications', auth, isStudent, applicationController.getAppliedInternships);
router.put('/update-resume', auth, isStudent, applicationController.updateResumeInApplications);
router.put('/:applicationId', auth, isStudent, applicationController.updateSingleApplication);
module.exports = router;