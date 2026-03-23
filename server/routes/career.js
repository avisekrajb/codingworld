const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');
const { protect, admin } = require('../middleware/auth');

// Public route
router.post('/apply', careerController.submitApplication);

// Admin routes
router.get('/applications', protect, admin, careerController.getApplications);
router.get('/stats', protect, admin, careerController.getStats);
router.patch('/applications/:id', protect, admin, careerController.updateStatus);

module.exports = router;