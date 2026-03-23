const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const feedbackController = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.post('/submit', 
  upload.single('photo'),
  feedbackController.submitFeedback
);

router.get('/list', feedbackController.getFeedbacks);
router.get('/stats', feedbackController.getFeedbackStats);

// Admin routes
router.get('/admin/all', protect, admin, feedbackController.getAllFeedback);
router.patch('/admin/:id', protect, admin, feedbackController.updateFeedbackStatus);

module.exports = router;