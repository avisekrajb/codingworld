const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const adminController = require('../controllers/adminController');
const consultationController = require('../controllers/consultationController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/visitor/track', adminController.trackVisitor);
router.get('/visitor/count', adminController.getVisitorCount);
router.get('/visitor/stats', adminController.getVisitorStats);
router.get('/services/public', adminController.getServices);
router.get('/pricing/public', adminController.getPricing);
router.get('/projects/public', adminController.getProjects);

// Protected admin routes
router.use(protect, admin);

// Dashboard stats
router.get('/stats', adminController.getDashboardStats);
router.get('/analytics', adminController.getAnalytics);

// Service management
router.get('/services', adminController.getAllServices);
router.post('/services', adminController.createService);
router.put('/services/:id', adminController.updateService);
router.delete('/services/:id', adminController.deleteService);
router.post('/services/reorder', adminController.reorderServices);

// Pricing management
router.get('/pricing', adminController.getPricing);
router.get('/pricing/:plan/history', adminController.getPricingHistory);
router.put('/pricing/:plan', adminController.updatePricing);
router.post('/pricing/:plan/restore', adminController.restorePricingVersion);

// Project management - Updated for multiple image uploads
router.get('/projects', adminController.getAllProjects);
router.post('/projects', 
  upload.array('images', 5), // Allow up to 5 images with field name 'images'
  adminController.createProject
);
router.put('/projects/:id', 
  upload.array('images', 5), // Allow up to 5 images with field name 'images'
  adminController.updateProject
);
router.delete('/projects/:id', adminController.deleteProject);

// Internship management
router.get('/internships', adminController.getInternships);
router.get('/internships/:id', adminController.getInternshipById);
router.patch('/internships/:id', adminController.updateInternshipStatus);
router.post('/internships/bulk', adminController.bulkUpdateInternships);
router.delete('/internships/:id', adminController.deleteInternship);

// Feedback management
router.get('/feedback', adminController.getFeedbacks);
router.get('/feedback/:id', adminController.getFeedbackById);
router.patch('/feedback/:id', adminController.updateFeedbackStatus);
router.post('/feedback/bulk', adminController.bulkUpdateFeedbacks);
router.delete('/feedback/:id', adminController.deleteFeedback);

// Consultation management
router.get('/consultations', consultationController.getConsultations);
router.get('/consultations/stats', consultationController.getConsultationStats);
router.get('/consultations/:id', consultationController.getConsultationById);
router.patch('/consultations/:id', consultationController.updateConsultationStatus);
router.delete('/consultations/:id', consultationController.deleteConsultation);

module.exports = router;