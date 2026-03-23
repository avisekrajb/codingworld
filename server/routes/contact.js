const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

// Public route
router.post('/submit', contactController.submitContact);

// Admin routes
router.get('/messages', protect, admin, contactController.getMessages);
router.get('/stats', protect, admin, contactController.getContactStats);
router.post('/reply/:id', protect, admin, contactController.replyToMessage);

module.exports = router;