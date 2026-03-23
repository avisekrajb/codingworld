const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize express app FIRST
const app = express();

// Middleware - apply these BEFORE routes
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically with proper headers
app.use('/uploads', express.static(uploadDir, {
  setHeaders: (res, filePath) => {
    // Set proper content type for PDF files
    if (path.extname(filePath).toLowerCase() === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + path.basename(filePath) + '"');
    }
    // Set proper content type for DOC files
    if (path.extname(filePath).toLowerCase() === '.doc') {
      res.setHeader('Content-Type', 'application/msword');
      res.setHeader('Content-Disposition', 'inline; filename="' + path.basename(filePath) + '"');
    }
    // Set proper content type for DOCX files
    if (path.extname(filePath).toLowerCase() === '.docx') {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'inline; filename="' + path.basename(filePath) + '"');
    }
  }
}));

// Add a route to serve files with authentication
app.get('/api/admin/cv/:filename', async (req, res) => {
  try {
    // Check admin authentication
    const adminKey = req.headers['admin-key'];
    if (adminKey !== 'coding-world-admin-2025') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Get file extension
    const ext = path.extname(filename).toLowerCase();
    
    // Set proper headers based on file type
    if (ext === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
    } else if (ext === '.doc') {
      res.setHeader('Content-Type', 'application/msword');
      res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
    } else if (ext === '.docx') {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
    } else {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
    }

    // Send file
    res.sendFile(filepath);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ success: false, message: 'Error serving file' });
  }
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coding-world';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  initPricing();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Initialize default pricing data
const initPricing = async () => {
  try {
    const Pricing = require('./models/Pricing');
    
    const FREE_PLAN = [
      { icon: "🎯", label: "Demo", desc: "Live demo of your project concept" },
      { icon: "💡", label: "Understand", desc: "Deep requirement analysis session" },
      { icon: "🤝", label: "Meetup", desc: "1-on-1 consultation call" },
      { icon: "📄", label: "Paper", desc: "Project scope document" },
      { icon: "📋", label: "Documents", desc: "Technical specification sheets" },
      { icon: "🔒", label: "Baina", desc: "Initial agreement & commitment" }
    ];

    const UPGRADE_PLAN = [
      { icon: "⚡", label: "Priority Support", desc: "24/7 dedicated support channel" },
      { icon: "🎨", label: "Custom Design", desc: "Unique UI tailored to your brand" },
      { icon: "🔄", label: "Unlimited Revisions", desc: "Until you're 100% satisfied" },
      { icon: "📊", label: "Analytics Setup", desc: "Full tracking & reporting dashboard" },
      { icon: "🚀", label: "Deployment", desc: "Full server setup & go-live" },
      { icon: "📱", label: "Mobile Optimized", desc: "Perfect on every device" }
    ];

    const PREMIUM_FEATURES = [
      { icon: "👑", label: "Dedicated Manager", desc: "Personal project manager assigned" },
      { icon: "🔐", label: "SSL & Security", desc: "Enterprise-grade security setup" },
      { icon: "💾", label: "Database Design", desc: "Optimized schema architecture" },
      { icon: "🌐", label: "Domain & Hosting", desc: "1-year hosting included" },
      { icon: "📧", label: "Email Setup", desc: "Business email configuration" },
      { icon: "🤖", label: "AI Integration", desc: "Smart AI features in your app" }
    ];

    const defaultPricing = [
      { plan: 'free', price: '₹0', features: FREE_PLAN, isPopular: false, description: 'No commitment needed' },
      { plan: 'upgrade', price: '₹500', features: UPGRADE_PLAN, isPopular: true, description: 'One-time project fee', badge: 'POPULAR' },
      { plan: 'premium', price: 'Custom', features: PREMIUM_FEATURES, isPopular: false, description: 'Enterprise-grade, fully custom' }
    ];
    
    for (const p of defaultPricing) {
      await Pricing.findOneAndUpdate(
        { plan: p.plan },
        p,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Default pricing initialized');
  } catch (error) {
    console.error('❌ Error initializing pricing:', error);
  }
};

// Import routes
const internshipRoutes = require('./routes/internship');
const adminRoutes = require('./routes/admin');
const feedbackRoutes = require('./routes/feedback');
const consultationRoutes = require('./routes/consultation');
const visitorRoutes = require('./routes/visitor'); // ADD THIS LINE

// Use routes
app.use('/api/internship', internshipRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/consultation', consultationRoutes);
// Add this with other routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/visitor', visitorRoutes); // ADD THIS LINE
// Add with other routes
app.use('/api/careers', require('./routes/career'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log(`📁 Uploads directory: ${uploadDir}`);
});