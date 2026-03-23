const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { protect, admin } = require('../middleware/auth');

// Public route - Submit consultation
router.post('/', consultationController.submitConsultation);

// Admin routes (protected)
router.get('/admin', protect, admin, consultationController.getConsultations);
router.get('/admin/stats', protect, admin, consultationController.getConsultationStats); // Add this
router.get('/admin/:id', protect, admin, consultationController.getConsultationById);
router.patch('/admin/:id', protect, admin, consultationController.updateConsultationStatus);
router.delete('/admin/:id', protect, admin, consultationController.deleteConsultation);

module.exports = router;