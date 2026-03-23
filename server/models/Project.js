const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  desc: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  detailedDesc: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  color: {
    type: String,
    default: '#00e5ff'
  },
  emoji: {
    type: String,
    default: '🚀'
  },
  liveUrl: {
    type: String,
    default: '#'
  },
  githubUrl: {
    type: String,
    default: ''
  },
  features: [{
    type: String,
    trim: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  client: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  images: [{
    type: String,
    required: [true, 'At least one project image is required']
  }],
  cloudinaryIds: [{
    type: String
  }],
  thumbnailIndex: {
    type: Number,
    default: 0,
    min: 0
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for getting thumbnail URL
projectSchema.virtual('thumbnail').get(function() {
  if (this.images && this.images.length > 0) {
    return this.images[this.thumbnailIndex] || this.images[0];
  }
  return null;
});

// Ensure virtuals are included in JSON output
projectSchema.set('toJSON', { 
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});
projectSchema.set('toObject', { virtuals: true });

// Remove the problematic text index and use regular indexes instead
// Index for faster queries - use individual field indexes instead of text index
projectSchema.index({ title: 1 }); // Regular index on title
projectSchema.index({ tags: 1 }); // Regular index on tags (works with arrays)
projectSchema.index({ isActive: 1 });
projectSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);  