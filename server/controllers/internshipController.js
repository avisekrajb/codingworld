const Internship = require('../models/Internship');
const { sendApplicationEmail } = require('../utils/emailService');
const fs = require('fs');
const path = require('path');

// Submit internship application
exports.submitApplication = async (req, res) => {
  try {
    const { name, email, phone, tracks, duration } = req.body;
    
    // Parse tracks if they came as string
    const parsedTracks = typeof tracks === 'string' ? JSON.parse(tracks) : tracks;

    // Validate required fields
    if (!name || !email || !phone || !parsedTracks || !duration) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if email already exists
    const existingApplication = await Internship.findOne({ email });
    if (existingApplication) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'An application with this email already exists'
      });
    }

    // Get CV path
    const cvPath = req.file ? req.file.path : null;
    if (!cvPath) {
      return res.status(400).json({
        success: false,
        message: 'CV is required'
      });
    }

    // Create application
    const application = await Internship.create({
      name,
      email,
      phone,
      tracks: parsedTracks,
      duration,
      cvPath
    });

    // Send email notification
    try {
      await sendApplicationEmail({
        name,
        email,
        phone,
        tracks: parsedTracks,
        duration,
        cvPath
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: application._id,
        name: application.name,
        email: application.email
      }
    });

  } catch (error) {
    // Delete uploaded file if there's an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all applications (admin only - can be protected later)
exports.getApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};
    
    const applications = await Internship.find(query)
      .sort({ appliedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Internship.countDocuments(query);

    res.json({
      success: true,
      data: applications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
};

// Update application status (admin only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await Internship.findByIdAndUpdate(
      id,
      {
        status,
        notes,
        reviewedAt: Date.now()
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application'
    });
  }
};