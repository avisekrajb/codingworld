const Career = require('../models/Career');
const { sendCareerApplicationEmail, sendCareerStatusEmail } = require('../utils/emailService');

exports.submitApplication = async (req, res) => {
  try {
    const { name, email, phone, position, experience, portfolio, message } = req.body;

    const application = await Career.create({
      name,
      email,
      phone,
      position,
      experience,
      portfolio,
      message,
      status: 'pending'
    });

    // Send confirmation email to applicant
    await sendCareerApplicationEmail({ name, email, position, experience, message });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });

  } catch (error) {
    console.error('Career application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application'
    });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};
    
    const applications = await Career.find(query)
      .sort({ appliedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Career.countDocuments(query);

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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Career.countDocuments();
    const pending = await Career.countDocuments({ status: 'pending' });
    const reviewed = await Career.countDocuments({ status: 'reviewed' });
    const shortlisted = await Career.countDocuments({ status: 'shortlisted' });
    const rejected = await Career.countDocuments({ status: 'rejected' });

    res.json({
      success: true,
      data: {
        total,
        pending,
        reviewed,
        shortlisted,
        rejected
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await Career.findById(id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update status
    application.status = status;
    application.notes = notes || application.notes;
    application.reviewedAt = Date.now();
    
    await application.save();

    // Send email based on status
    try {
      if (status === 'shortlisted') {
        await sendCareerStatusEmail(application, 'shortlisted');
      } else if (status === 'rejected') {
        await sendCareerStatusEmail(application, 'rejected');
      } else if (status === 'reviewed') {
        // Optional: send reviewed notification
        await sendCareerStatusEmail(application, 'reviewed');
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      data: application
    });

  } catch (error) {
    console.error('Error updating career application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application'
    });
  }
};