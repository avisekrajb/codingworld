const mongoose = require('mongoose');

// Feature schema
const pricingFeatureSchema = new mongoose.Schema({
  icon: {
    type: String,
    default: '✓'
  },
  label: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  }
}, { _id: false });

// History entry schema
const historyEntrySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'RESTORE'],
    default: 'UPDATE'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  admin: {
    type: String,
    default: 'Admin'
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  previousState: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

// Main pricing schema
const pricingSchema = new mongoose.Schema({
  plan: {
    type: String,
    enum: ['free', 'upgrade', 'premium'],
    required: true,
    unique: true
  },
  price: {
    type: String,
    required: true,
    default: function() {
      switch(this.plan) {
        case 'free': return '₹0';
        case 'upgrade': return '₹500';
        case 'premium': return 'Custom';
        default: return '₹0';
      }
    }
  },
  description: {
    type: String,
    default: function() {
      switch(this.plan) {
        case 'free': return 'No commitment needed';
        case 'upgrade': return 'One-time project fee';
        case 'premium': return 'Enterprise-grade, fully custom';
        default: return '';
      }
    }
  },
  features: {
    type: [pricingFeatureSchema],
    default: function() {
      switch(this.plan) {
        case 'free':
          return [
            { icon: "🎯", label: "Demo", desc: "Live demo of your project concept" },
            { icon: "💡", label: "Understand", desc: "Deep requirement analysis session" },
            { icon: "🤝", label: "Meetup", desc: "1-on-1 consultation call" },
            { icon: "📄", label: "Paper", desc: "Project scope document" },
            { icon: "📋", label: "Documents", desc: "Technical specification sheets" },
            { icon: "🔒", label: "Baina", desc: "Initial agreement & commitment" }
          ];
        case 'upgrade':
          return [
            { icon: "⚡", label: "Priority Support", desc: "24/7 dedicated support channel" },
            { icon: "🎨", label: "Custom Design", desc: "Unique UI tailored to your brand" },
            { icon: "🔄", label: "Unlimited Revisions", desc: "Until you're 100% satisfied" },
            { icon: "📊", label: "Analytics Setup", desc: "Full tracking & reporting dashboard" },
            { icon: "🚀", label: "Deployment", desc: "Full server setup & go-live" },
            { icon: "📱", label: "Mobile Optimized", desc: "Perfect on every device" }
          ];
        case 'premium':
          return [
            { icon: "👑", label: "Dedicated Manager", desc: "Personal project manager assigned" },
            { icon: "🔐", label: "SSL & Security", desc: "Enterprise-grade security setup" },
            { icon: "💾", label: "Database Design", desc: "Optimized schema architecture" },
            { icon: "🌐", label: "Domain & Hosting", desc: "1-year hosting included" },
            { icon: "📧", label: "Email Setup", desc: "Business email configuration" },
            { icon: "🤖", label: "AI Integration", desc: "Smart AI features in your app" }
          ];
        default:
          return [];
      }
    }
  },
  isPopular: {
    type: Boolean,
    default: function() {
      return this.plan === 'upgrade';
    }
  },
  badge: {
    type: String,
    default: function() {
      return this.plan === 'upgrade' ? 'POPULAR' : '';
    }
  },
  history: {
    type: [historyEntrySchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt timestamp on save
pricingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure history is always an array
pricingSchema.pre('save', function(next) {
  if (!this.history) {
    this.history = [];
  }
  next();
});

module.exports = mongoose.model('Pricing', pricingSchema);