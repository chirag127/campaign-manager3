const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  budget: {
    total: {
      type: Number,
      required: true
    },
    daily: {
      type: Number,
      required: true
    },
    spent: {
      type: Number,
      default: 0
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'failed'],
    default: 'draft'
  },
  targetAudience: {
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 65 }
    },
    gender: {
      type: [String],
      default: ['male', 'female', 'other']
    },
    locations: [{
      country: String,
      state: String,
      city: String
    }],
    interests: [String],
    languages: [String],
    customAudiences: [String]
  },
  platforms: [{
    name: {
      type: String,
      enum: ['facebook', 'google', 'youtube', 'linkedin', 'twitter', 'snapchat', 'instagram'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'paused', 'completed', 'failed'],
      default: 'pending'
    },
    platformCampaignId: String,
    budget: {
      allocated: Number,
      spent: { type: Number, default: 0 }
    },
    performance: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      costPerClick: { type: Number, default: 0 },
      costPerConversion: { type: Number, default: 0 },
      ctr: { type: Number, default: 0 } // Click-through rate
    },
    lastSynced: Date
  }],
  creatives: [{
    type: {
      type: String,
      enum: ['image', 'video', 'carousel', 'text'],
      required: true
    },
    title: String,
    description: String,
    mediaUrl: String,
    callToAction: String,
    destinationUrl: String
  }],
  abTests: [{
    name: String,
    variants: [{
      name: String,
      creativeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creative'
      },
      performance: {
        impressions: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 },
        conversions: { type: Number, default: 0 },
        ctr: { type: Number, default: 0 }
      }
    }],
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active'
    },
    winningVariant: String
  }],
  leads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Update the updatedAt field before saving
CampaignSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Campaign', CampaignSchema);
