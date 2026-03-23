const Visitor = require('../models/Visitor');
const Service = require('../models/Service');
const Pricing = require('../models/Pricing');
const Project = require('../models/Project');
const Internship = require('../models/Internship');
const Feedback = require('../models/Feedback');
const Consultation = require('../models/Consultation');
const { sendStatusUpdateEmail, sendFeedbackReplyEmail, sendConsultationEmail } = require('../utils/emailService');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

// ==================== VISITOR TRACKING ====================

exports.trackVisitor = async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || '127.0.0.1';
    
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = new Visitor({ 
        count: 1,
        todayVisitors: [{ ip: clientIp, visitedAt: new Date() }],
        dailyStats: [{
          date: new Date().setHours(0,0,0,0),
          count: 1
        }]
      });
      await visitor.save();
      return res.json({ count: 1, isNew: true });
    }

    // Check if IP visited today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingToday = visitor.todayVisitors.find(v => 
      v.ip === clientIp && new Date(v.visitedAt) >= today
    );

    if (!existingToday) {
      visitor.count += 1;
      visitor.todayVisitors.push({ ip: clientIp, visitedAt: new Date() });
      
      // Update daily stats
      const todayStat = visitor.dailyStats.find(s => new Date(s.date).setHours(0,0,0,0) === today.getTime());
      if (todayStat) {
        todayStat.count += 1;
      } else {
        visitor.dailyStats.push({
          date: today,
          count: 1
        });
      }
      
      // Clean old visitors (keep last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      visitor.todayVisitors = visitor.todayVisitors.filter(v => 
        new Date(v.visitedAt) >= thirtyDaysAgo
      );
      visitor.dailyStats = visitor.dailyStats.filter(s => 
        new Date(s.date) >= thirtyDaysAgo
      );
      
      await visitor.save();
    }

    res.json({ 
      count: visitor.count, 
      isNew: !existingToday,
      todayCount: visitor.dailyStats.find(s => new Date(s.date).setHours(0,0,0,0) === today.getTime())?.count || 0
    });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    res.status(500).json({ error: 'Failed to track visitor' });
  }
};

exports.getVisitorCount = async (req, res) => {
  try {
    const visitor = await Visitor.findOne();
    res.json({ count: visitor ? visitor.count : 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get visitor count' });
  }
};

exports.getVisitorStats = async (req, res) => {
  try {
    const visitor = await Visitor.findOne();
    const today = new Date().setHours(0,0,0,0);
    
    const weeklyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0,0,0,0);
      
      const stat = visitor?.dailyStats?.find(s => 
        new Date(s.date).setHours(0,0,0,0) === date.getTime()
      );
      
      weeklyStats.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: stat?.count || 0
      });
    }

    res.json({
      success: true,
      data: {
        total: visitor?.count || 0,
        today: visitor?.dailyStats?.find(s => new Date(s.date).setHours(0,0,0,0) === today)?.count || 0,
        weekly: weeklyStats,
        uniqueToday: visitor?.todayVisitors?.filter(v => 
          new Date(v.visitedAt).setHours(0,0,0,0) === today
        ).length || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get visitor stats' });
  }
};

// ==================== SERVICE MANAGEMENT ====================

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort('order');
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort('order');
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.reorderServices = async (req, res) => {
  try {
    const { orders } = req.body;
    
    for (const item of orders) {
      await Service.findByIdAndUpdate(item.id, { order: item.order });
    }
    
    res.json({ success: true, message: 'Services reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== PRICING MANAGEMENT ====================
exports.getPricing = async (req, res) => {
  try {
    // Set cache control headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const pricing = await Pricing.find().sort('plan');
    res.json({ success: true, data: pricing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updatePricing = async (req, res) => {
  try {
    const { plan } = req.params;
    const updateData = req.body;
    
    console.log(`Updating pricing for plan: ${plan}`, updateData);

    // Find existing pricing
    let pricing = await Pricing.findOne({ plan });
    
    if (!pricing) {
      // Create new pricing if it doesn't exist
      pricing = new Pricing({ 
        plan,
        ...updateData,
        history: []
      });
    } else {
      // Add to history before updating
      const historyEntry = {
        action: 'UPDATE',
        timestamp: new Date(),
        admin: req.body.admin || 'Admin',
        changes: updateData,
        previousState: {
          price: pricing.price,
          description: pricing.description,
          features: pricing.features,
          isPopular: pricing.isPopular,
          badge: pricing.badge
        }
      };

      // Initialize history if it doesn't exist
      if (!pricing.history) {
        pricing.history = [];
      }

      // Add to history (keep last 20 entries)
      pricing.history = [historyEntry, ...pricing.history].slice(0, 20);
      
      // Update fields
      pricing.price = updateData.price || pricing.price;
      pricing.description = updateData.description || pricing.description;
      pricing.features = updateData.features || pricing.features;
      pricing.isPopular = updateData.isPopular !== undefined ? updateData.isPopular : pricing.isPopular;
      pricing.badge = updateData.badge || pricing.badge;
    }

    // Save the pricing
    await pricing.save();

    console.log('Pricing updated successfully:', pricing._id);

    res.json({ 
      success: true, 
      data: pricing,
      message: 'Pricing updated successfully'
    });
  } catch (error) {
    console.error('Error updating pricing:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to update pricing'
    });
  }
};

exports.getPricingHistory = async (req, res) => {
  try {
    const { plan } = req.params;
    const pricing = await Pricing.findOne({ plan });
    
    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found'
      });
    }

    res.json({
      success: true,
      data: pricing.history || []
    });
  } catch (error) {
    console.error('Error getting pricing history:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.restorePricingVersion = async (req, res) => {
  try {
    const { plan } = req.params;
    const { versionId, admin } = req.body;

    const pricing = await Pricing.findOne({ plan });
    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found'
      });
    }

    // Find the version in history
    const version = pricing.history.id(versionId);
    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Version not found'
      });
    }

    // Store current state for history
    const previousState = {
      price: pricing.price,
      features: pricing.features,
      description: pricing.description,
      isPopular: pricing.isPopular,
      badge: pricing.badge
    };

    // Restore from version
    pricing.price = version.changes.price || pricing.price;
    pricing.features = version.changes.features || pricing.features;
    pricing.description = version.changes.description || pricing.description;
    pricing.isPopular = version.changes.isPopular !== undefined ? version.changes.isPopular : pricing.isPopular;
    pricing.badge = version.changes.badge || pricing.badge;

    // Add restore to history
    const restoreEntry = {
      action: 'RESTORE',
      timestamp: new Date(),
      admin: admin || 'Admin',
      changes: version.changes,
      previousState
    };

    pricing.history = [restoreEntry, ...pricing.history].slice(0, 20);
    await pricing.save();

    res.json({
      success: true,
      data: pricing,
      message: 'Version restored successfully'
    });
  } catch (error) {
    console.error('Error restoring version:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ==================== PROJECT MANAGEMENT ====================

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true }).sort('-createdAt');
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort('-createdAt');
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create project with multiple images
exports.createProject = async (req, res) => {
  try {
    console.log('📦 Received project creation request');
    console.log('Body:', req.body);
    console.log('Files:', req.files ? req.files.length : 0);

    const { 
      title, 
      desc, 
      detailedDesc, 
      tags, 
      color, 
      emoji, 
      liveUrl, 
      githubUrl, 
      features, 
      technologies, 
      client, 
      duration, 
      thumbnailIndex 
    } = req.body;
    
    // Validate required fields
    if (!title || !desc) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Parse JSON strings safely
    let parsedTags = [];
    let parsedFeatures = [];
    let parsedTechnologies = [];

    try {
      parsedTags = tags ? JSON.parse(tags) : [];
      parsedFeatures = features ? JSON.parse(features) : [];
      parsedTechnologies = technologies ? JSON.parse(technologies) : [];
    } catch (parseError) {
      console.error('Error parsing JSON fields:', parseError);
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format in form data'
      });
    }

    // Handle multiple image uploads
    const imageUrls = [];
    const cloudinaryIds = [];

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      console.log('❌ No files uploaded');
      return res.status(400).json({
        success: false,
        message: 'At least one project image is required'
      });
    }

    console.log(`📸 Uploading ${req.files.length} images to Cloudinary...`);

    // Upload each image to Cloudinary
    for (const [index, file] of req.files.entries()) {
      try {
        console.log(`Uploading image ${index + 1}/${req.files.length}: ${file.originalname}`);
        
        // Check if file exists
        if (!file.path || !fs.existsSync(file.path)) {
          throw new Error(`File not found at path: ${file.path}`);
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'coding-world/projects',
          transformation: [
            { width: 1200, height: 800, crop: 'fill' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        });
        
        console.log(`✅ Image ${index + 1} uploaded:`, result.secure_url);
        
        imageUrls.push(result.secure_url);
        cloudinaryIds.push(result.public_id);
        
        // Delete local file after successful upload
        try {
          fs.unlinkSync(file.path);
          console.log(`✅ Local file deleted: ${file.path}`);
        } catch (deleteError) {
          console.error('⚠️ Error deleting local file:', deleteError);
          // Don't throw, continue with the process
        }
      } catch (uploadError) {
        console.error(`❌ Error uploading image ${index + 1}:`, uploadError);
        
        // Clean up any successfully uploaded images from Cloudinary
        for (const id of cloudinaryIds) {
          try {
            await cloudinary.uploader.destroy(id);
          } catch (cleanupError) {
            console.error('Error cleaning up Cloudinary:', cleanupError);
          }
        }
        
        // Clean up local files
        if (req.files) {
          req.files.forEach(f => {
            try {
              if (f.path && fs.existsSync(f.path)) {
                fs.unlinkSync(f.path);
              }
            } catch (e) {
              console.error('Error deleting file:', e);
            }
          });
        }
        
        return res.status(500).json({
          success: false,
          message: `Failed to upload image: ${uploadError.message}`
        });
      }
    }

    // Create project data
    const projectData = {
      title,
      desc,
      detailedDesc: detailedDesc || '',
      tags: parsedTags,
      color: color || '#00e5ff',
      emoji: emoji || '🚀',
      liveUrl: liveUrl || '#',
      githubUrl: githubUrl || '',
      features: parsedFeatures,
      technologies: parsedTechnologies,
      client: client || '',
      duration: duration || '',
      images: imageUrls,
      cloudinaryIds,
      thumbnailIndex: parseInt(thumbnailIndex) || 0,
      isActive: true
    };

    console.log('📝 Creating project with data:', projectData);

    // Create project in database
    const project = new Project(projectData);
    
    // Validate before saving
    const validationError = project.validateSync();
    if (validationError) {
      console.error('❌ Validation error:', validationError);
      
      // Clean up uploaded images from Cloudinary
      for (const id of cloudinaryIds) {
        try {
          await cloudinary.uploader.destroy(id);
        } catch (cleanupError) {
          console.error('Error cleaning up Cloudinary:', cleanupError);
        }
      }
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(validationError.errors).map(err => err.message)
      });
    }

    await project.save();
    
    console.log('✅ Project created successfully:', project._id);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('❌ Error creating project:', error);
    
    // Clean up any uploaded files if there was an error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (e) {
          console.error('Error deleting file:', e);
        }
      });
    }
    
    // Check for specific error types
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate key error. A project with this title may already exist.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create project',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      desc, 
      detailedDesc, 
      tags, 
      color, 
      emoji, 
      liveUrl, 
      githubUrl, 
      features, 
      technologies, 
      client, 
      duration, 
      thumbnailIndex,
      existingImages 
    } = req.body;
    
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Parse JSON strings
    const parsedTags = tags ? JSON.parse(tags) : project.tags;
    const parsedFeatures = features ? JSON.parse(features) : project.features;
    const parsedTechnologies = technologies ? JSON.parse(technologies) : project.technologies;
    const parsedExistingImages = existingImages ? JSON.parse(existingImages) : project.images;

    // Start with existing images
    let imageUrls = [...parsedExistingImages];
    let cloudinaryIds = project.cloudinaryIds || [];

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'coding-world/projects',
            transformation: [
              { width: 1200, height: 800, crop: 'fill' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          });
          
          imageUrls.push(result.secure_url);
          cloudinaryIds.push(result.public_id);
          
          // Delete local file
          fs.unlinkSync(file.path);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          // Clean up the file if upload failed
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
            console.error('Error deleting file:', e);
          }
        }
      }
    }

    // Ensure at least one image exists
    if (imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one project image is required'
      });
    }

    const updateData = {
      title: title || project.title,
      desc: desc || project.desc,
      detailedDesc: detailedDesc || project.detailedDesc,
      tags: parsedTags,
      color: color || project.color,
      emoji: emoji || project.emoji,
      liveUrl: liveUrl || project.liveUrl,
      githubUrl: githubUrl || project.githubUrl,
      features: parsedFeatures,
      technologies: parsedTechnologies,
      client: client || project.client,
      duration: duration || project.duration,
      images: imageUrls,
      cloudinaryIds,
      thumbnailIndex: parseInt(thumbnailIndex) || project.thumbnailIndex || 0,
      updatedAt: Date.now()
    };

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true 
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error);
    
    // Clean up uploaded files if there was an error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (e) {
          console.error('Error deleting file:', e);
        }
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update project',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Delete all images from Cloudinary
    if (project.cloudinaryIds && project.cloudinaryIds.length > 0) {
      for (const cloudinaryId of project.cloudinaryIds) {
        try {
          await cloudinary.uploader.destroy(cloudinaryId);
        } catch (cloudinaryError) {
          console.error('Error deleting from Cloudinary:', cloudinaryError);
        }
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== INTERNSHIP MANAGEMENT ====================

exports.getInternships = async (req, res) => {
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
    
    const internships = await Internship.find(query)
      .sort({ appliedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Internship.countDocuments(query);

    res.json({
      success: true,
      data: internships,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateInternshipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, sendEmail } = req.body;

    const internship = await Internship.findByIdAndUpdate(
      id,
      {
        status,
        notes,
        reviewedAt: Date.now()
      },
      { new: true }
    );

    if (!internship) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Send email if requested
    if (sendEmail && (status === 'accepted' || status === 'rejected')) {
      try {
        await sendStatusUpdateEmail(internship, status, notes);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    res.json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.bulkUpdateInternships = async (req, res) => {
  try {
    const { ids, status, notes } = req.body;
    
    const result = await Internship.updateMany(
      { _id: { $in: ids } },
      { 
        status, 
        notes, 
        reviewedAt: Date.now() 
      }
    );

    res.json({ 
      success: true, 
      message: `Updated ${result.modifiedCount} applications`,
      data: result 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Delete CV file if exists
    if (internship.cvPath) {
      try {
        fs.unlinkSync(internship.cvPath);
      } catch (fileError) {
        console.error('Error deleting CV file:', fileError);
      }
    }

    await Internship.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== FEEDBACK MANAGEMENT ====================

exports.getFeedbacks = async (req, res) => {
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
        { comment: { $regex: search, $options: 'i' } }
      ];
    }
    
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
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

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
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    // Send reply email if status is approved/rejected
    if (status === 'approved' || status === 'rejected') {
      try {
        await sendFeedbackReplyEmail(feedback, status, replyMessage);
      } catch (emailError) {
        console.error('Reply email failed:', emailError);
      }
    }

    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.bulkUpdateFeedbacks = async (req, res) => {
  try {
    const { ids, status, replyMessage } = req.body;
    
    const result = await Feedback.updateMany(
      { _id: { $in: ids } },
      { 
        status, 
        replyMessage, 
        repliedAt: Date.now() 
      }
    );

    res.json({ 
      success: true, 
      message: `Updated ${result.modifiedCount} feedbacks`,
      data: result 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    // Delete image from Cloudinary
    if (feedback.cloudinaryId) {
      await cloudinary.uploader.destroy(feedback.cloudinaryId);
    }

    await Feedback.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== CONSULTATION MANAGEMENT ====================

exports.getConsultations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
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
    res.status(500).json({ success: false, error: error.message });
  }
};

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
      return res.status(404).json({ success: false, error: 'Consultation not found' });
    }

    // Send email notification
    try {
      await sendConsultationEmail(consultation, status);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({ success: true, data: consultation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== DASHBOARD STATS ====================

exports.getDashboardStats = async (req, res) => {
  try {
    const visitor = await Visitor.findOne();
    const totalApplications = await Internship.countDocuments();
    const pendingApplications = await Internship.countDocuments({ status: 'pending' });
    const totalProjects = await Project.countDocuments({ isActive: true });
    const totalServices = await Service.countDocuments({ isActive: true });
    const totalFeedback = await Feedback.countDocuments();
    const pendingFeedback = await Feedback.countDocuments({ status: 'pending' });
    const totalConsultations = await Consultation.countDocuments();
    const pendingConsultations = await Consultation.countDocuments({ status: 'pending' });

    // Recent activities
    const recentApplications = await Internship.find()
      .sort({ appliedAt: -1 })
      .limit(5)
      .select('name status appliedAt');
    
    const recentFeedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name rating status createdAt');
    
    const recentConsultations = await Consultation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name plan status createdAt');

    // Monthly stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyApplications = await Internship.countDocuments({
      appliedAt: { $gte: thirtyDaysAgo }
    });

    const monthlyFeedback = await Feedback.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        visitors: visitor ? visitor.count : 0,
        todayVisitors: visitor?.dailyStats?.slice(-1)[0]?.count || 0,
        applications: totalApplications,
        pendingApplications,
        totalProjects,
        totalServices,
        totalFeedback,
        pendingFeedback,
        totalConsultations,
        pendingConsultations,
        monthlyApplications,
        monthlyFeedback,
        recentActivities: {
          applications: recentApplications,
          feedback: recentFeedback,
          consultations: recentConsultations
        }
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Applications over time
    const applicationsOverTime = await Internship.aggregate([
      { $match: { appliedAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$appliedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Feedback over time
    const feedbackOverTime = await Feedback.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Popular tracks
    const popularTracks = await Internship.aggregate([
      { $unwind: '$tracks' },
      {
        $group: {
          _id: '$tracks',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Average rating
    const avgRating = await Feedback.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          total: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        applicationsOverTime,
        feedbackOverTime,
        popularTracks,
        averageRating: avgRating[0]?.average || 0,
        totalRatings: avgRating[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};