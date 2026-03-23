const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const {
  submitApplication,
  getApplications,
  updateApplicationStatus
} = require('../controllers/internshipController');

// Validation rules
const validateApplication = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('tracks').custom((value) => {
    const tracks = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(tracks) && tracks.length > 0;
  }).withMessage('At least one track must be selected'),
  body('duration').isIn(['2 Months', '3 Months', '4 Months']).withMessage('Valid duration is required')
];

// Routes
router.post('/apply', 
  upload.single('cv'),
  validateApplication,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete uploaded file if validation fails
      if (req.file) {
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    next();
  },
  submitApplication
);

router.get('/applications', getApplications);
router.patch('/applications/:id', updateApplicationStatus);

module.exports = router;