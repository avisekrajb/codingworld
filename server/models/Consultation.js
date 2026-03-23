const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  projectType: {
    type: String,
    enum: ['web', 'mobile', 'ecommerce', 'design', 'other', ''],
    default: ''
  },
  budget: {
    type: String,
    enum: ['< ₹50k', '₹50k-₹2L', '₹2L-₹5L', '> ₹5L', ''],
    default: ''
  },
  timeline: {
    type: String,
    enum: ['ASAP', '1 month', '3 months', 'flexible', ''],
    default: ''
  },
  message: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  plan: {
    type: String,
    enum: ['free', 'upgrade', 'premium'],
    default: 'upgrade'
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  scheduledDate: {
    type: Date
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on save
consultationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Consultation', consultationSchema);