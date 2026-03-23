const Consultation = require('../models/Consultation');
const { sendConsultationEmail, sendAdminNotificationEmail, sendConsultationStatusEmail } = require('../utils/emailService');

// Submit consultation request
exports.submitConsultation = async (req, res) => {
  try {
    const { name, email, phone, company, projectType, budget, timeline, message, plan } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required'
      });
    }

    // Create consultation in database
    const consultation = await Consultation.create({
      name,
      email,
      phone,
      company: company || '',
      projectType: projectType || '',
      budget: budget || '',
      timeline: timeline || '',
      message: message || '',
      plan: plan || 'upgrade',
      status: 'pending'
    });

    console.log('✅ Consultation saved:', consultation._id);

    // Send email notifications (don't wait for them)
    try {
      // Get plan details for email
      const planDetails = {
        free: { 
          name: 'FREE Plan', 
          price: '₹0',
          features: ['Live demo', 'Requirement analysis', '1-on-1 consultation', 'Scope document', 'Technical specs', 'Initial agreement']
        },
        upgrade: { 
          name: 'UPGRADE Plan', 
          price: '₹500',
          features: ['Priority 24/7 support', 'Custom design', 'Unlimited revisions', 'Analytics dashboard', 'Deployment', 'Mobile optimized']
        },
        premium: { 
          name: 'PREMIUM Plan', 
          price: 'Custom',
          features: ['Dedicated manager', 'SSL & security', 'Database design', 'Domain & hosting', 'Email setup', 'AI integration']
        }
      };

      const selectedPlan = planDetails[plan] || planDetails.upgrade;

      await sendConsultationEmail({
        name,
        email,
        phone,
        company,
        projectType,
        budget,
        timeline,
        message,
        plan: selectedPlan.name,
        price: selectedPlan.price,
        features: selectedPlan.features
      });

      await sendAdminNotificationEmail({
        name,
        email,
        phone,
        company,
        projectType,
        budget,
        timeline,
        message,
        plan: selectedPlan.name,
        consultationId: consultation._id
      });

      console.log('✅ Consultation emails sent');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully',
      data: {
        id: consultation._id,
        name: consultation.name,
        email: consultation.email,
        status: consultation.status
      }
    });

  } catch (error) {
    console.error('❌ Consultation submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit consultation request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all consultations (admin)
exports.getConsultations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const consultations = await Consultation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Consultation.countDocuments(query);

    res.json({
      success: true,
      data: consultations,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultations'
    });
  }
};

// Get consultation statistics (admin)
exports.getConsultationStats = async (req, res) => {
  try {
    const total = await Consultation.countDocuments();
    const pending = await Consultation.countDocuments({ status: 'pending' });
    const contacted = await Consultation.countDocuments({ status: 'contacted' });
    const scheduled = await Consultation.countDocuments({ status: 'scheduled' });
    const completed = await Consultation.countDocuments({ status: 'completed' });
    const cancelled = await Consultation.countDocuments({ status: 'cancelled' });

    // Plan distribution
    const planStats = await Consultation.aggregate([
      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyTrend = await Consultation.aggregate([
      {
        $match: { createdAt: { $gte: thirtyDaysAgo } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        contacted,
        scheduled,
        completed,
        cancelled,
        planStats,
        monthlyTrend
      }
    });
  } catch (error) {
    console.error('Error getting consultation stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get consultation statistics'
    });
  }
};

// Get single consultation by ID (admin)
exports.getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }
    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error fetching consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation'
    });
  }
};

// Update consultation status (admin)
exports.updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, scheduledDate } = req.body;

    const consultation = await Consultation.findByIdAndUpdate(
      id,
      {
        status,
        notes,
        scheduledDate,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Send status update email if needed
    if (status === 'scheduled' && scheduledDate) {
      try {
        await sendConsultationStatusEmail(consultation, status);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update consultation'
    });
  }
};

// Delete consultation (admin)
exports.deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }
    res.json({
      success: true,
      message: 'Consultation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete consultation'
    });
  }
};