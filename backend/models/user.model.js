const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  connectedPlatforms: {
    facebook: {
      connected: { type: Boolean, default: false },
      accessToken: String,
      refreshToken: String,
      tokenExpiry: Date,
      accountId: String
    },
    google: {
      connected: { type: Boolean, default: false },
      accessToken: String,
      refreshToken: String,
      tokenExpiry: Date,
      accountId: String
    },
    youtube: {
      connected: { type: Boolean, default: false },
      accessToken: String,
      refreshToken: String,
      tokenExpiry: Date,
      accountId: String
    },
    linkedin: {
      connected: { type: Boolean, default: false },
      accessToken: String,
      refreshToken: String,
      tokenExpiry: Date,
      accountId: String
    },
    twitter: {
      connected: { type: Boolean, default: false },
      accessToken: String,
      refreshToken: String,
      tokenExpiry: Date,
      accountId: String
    },
    snapchat: {
      connected: { type: Boolean, default: false },
      accessToken: String,
      refreshToken: String,
      tokenExpiry: Date,
      accountId: String
    },
    instagram: {
      connected: { type: Boolean, default: false },
      accessToken: String,
      refreshToken: String,
      tokenExpiry: Date,
      accountId: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
