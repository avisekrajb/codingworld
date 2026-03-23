const Feedback = require('../models/Feedback');
const { sendFeedbackEmail, sendFeedbackReplyEmail } = require('../utils/emailService');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, rating, comment } = req.body;

    // Validate required fields
    if (!name || !email || !comment) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Name, email, and comment are required'
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Photo is required'
      });
    }

    console.log('📸 Uploading to Cloudinary...');
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'coding-world/feedback',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    });

    console.log('✅ Cloudinary upload successful:', result.secure_url);

    // Delete local file
    fs.unlinkSync(req.file.path);

    // Create feedback in database
    const feedback = await Feedback.create({
      name,
      email,
      rating: parseInt(rating) || 5,
      comment,
      photo: result.secure_url,
      cloudinaryId: result.public_id,
      status: 'pending' // New feedback starts as pending
    });

    console.log('✅ Feedback saved to database:', feedback._id);

    // Send email notification (don't wait for it)
    try {
      await sendFeedbackEmail({ 
        name, 
        email, 
        rating: parseInt(rating) || 5, 
        comment, 
        photo: result.secure_url 
      });
      console.log('✅ Feedback email sent successfully');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });

  } catch (error) {
    console.error('❌ Feedback submission error:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    // Check for specific error types
    if (error.message.includes('Only image files')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all approved feedback
exports.getFeedbacks = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const feedbacks = await Feedback.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments({ status: 'approved' });

    console.log(`📊 Found ${feedbacks.length} approved feedbacks`);

    res.json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedbacks'
    });
  }
};

// Get feedback statistics
exports.getFeedbackStats = async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const approved = await Feedback.countDocuments({ status: 'approved' });
    const pending = await Feedback.countDocuments({ status: 'pending' });
    
    const avgResult = await Feedback.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);

    const fiveStar = await Feedback.countDocuments({ 
      status: 'approved', 
      rating: 5 
    });

    res.json({
      success: true,
      data: {
        total,
        approved,
        pending,
        averageRating: avgResult[0]?.avg || 0,
        fiveStar
      }
    });
  } catch (error) {
    console.error('❌ Error getting feedback stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics'
    });
  }
};

// Admin: Get all feedback (including pending)
exports.getAllFeedback = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};
    
    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments(query);

    res.json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching all feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedbacks'
    });
  }
};

// Admin: Update feedback status
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, replyMessage } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      {
        status,
        replyMessage,
        repliedAt: Date.now()
      },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Send reply email if status is approved/rejected
    if (status === 'approved' || status === 'rejected') {
      try {
        await sendFeedbackReplyEmail(feedback, status, replyMessage);
      } catch (emailError) {
        console.error('❌ Reply email failed:', emailError);
      }
    }

    res.json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error('❌ Error updating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback'
    });
  }
};