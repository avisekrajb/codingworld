const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
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
  tracks: {
    type: [String],
    required: [true, 'Please select at least one track'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Please select at least one track'
    }
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    enum: ['2 Months', '3 Months', '4 Months']
  },
  cvPath: {
    type: String,
    required: [true, 'CV is required']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  notes: String
});

// Index for faster queries
internshipSchema.index({ email: 1 });
internshipSchema.index({ status: 1 });
internshipSchema.index({ appliedAt: -1 });

module.exports = mongoose.model('Internship', internshipSchema);