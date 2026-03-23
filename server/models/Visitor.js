const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0
  },
  lastReset: {
    type: Date,
    default: Date.now
  },
  todayVisitors: [{
    ip: {
      type: String,
      required: true
    },
    visitedAt: {
      type: Date,
      default: Date.now
    },
    userAgent: String,
    page: String
  }],
  monthlyStats: [{
    month: String,
    year: Number,
    count: Number,
    uniqueIPs: [String]
  }]
}, {
  timestamps: true
});

// Index for faster queries
visitorSchema.index({ 'todayVisitors.visitedAt': -1 });
visitorSchema.index({ count: 1 });

module.exports = mongoose.model('Visitor', visitorSchema);