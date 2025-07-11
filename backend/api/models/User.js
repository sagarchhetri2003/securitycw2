// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const userSchema = new Schema({
//   name: { type: String },
//   email: {
//     type: String,
//     trim: true,
//   },
//   mobile_no: { type: String },
//   password: { type: String },
//   image: { type: String },
//   role: {
//     type: String,
//     enum: ['user', 'admin', 'super-admin'],
//     default: 'user',
//   },
//   otp: String,
//   otpExpiry: Date,
//   isVerified: { type: Boolean, default: false },

//   // Password security additions
//   passwordChangedAt: {
//     type: Date,
//     default: Date.now
//   },
//   passwordHistory: {
//     type: [String],
//     default: []
//   },
//   loginAttempts: {
//     type: Number,
//     default: 0
//   },
//   lockUntil: {
//     type: Date
//   }
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;


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

  // ✅ Password expiry enforcement
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },

  // ✅ Password history for reuse prevention (store last 3–5 password hashes)
  passwordHistory: {
    type: [String],
    default: [],
  },

  // ✅ Brute-force protection
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

userSchema.methods.isPasswordExpired = function () {
  const MAX_AGE_DAYS = 90;
  const diffMs = Date.now() - new Date(this.passwordChangedAt).getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > MAX_AGE_DAYS;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
