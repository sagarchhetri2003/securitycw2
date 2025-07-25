

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String },
  email: {
    type: String,
    trim: true,
    unique: true, // Ensure unique emails
    lowercase: true
  },
  mobile_no: { type: String },
  password: { type: String },
  image: { type: String },

  role: {
    type: String,
    enum: ['user', 'admin', 'super-admin'],
    default: 'user',
  },

  otp: String,
  otpExpiry: Date,
  isVerified: { type: Boolean, default: false },

  //  Password expiry enforcement
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },

  //  Password history for reuse prevention
  passwordHistory: {
    type: [String],
    default: [],
  },

  //  Store last plain password (for Levenshtein similarity check)
  lastPlainPassword: {
    type: String,
  },
//fingerprint: 
fingerprints: [
  {
    id: { type: String },               // visitorId from frontend
    userAgent: { type: String },        // browser/device info
    addedAt: { type: Date, default: Date.now }
  }
],

  // Brute-force protection
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  }
}, {
  timestamps: true
});

//  Password expiry method
userSchema.methods.isPasswordExpired = function () {
  const MAX_AGE_DAYS = 30;
  const diffMs = Date.now() - new Date(this.passwordChangedAt).getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > MAX_AGE_DAYS;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
