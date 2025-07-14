
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const nodemailer = require("nodemailer");
const axios = require("axios");
const levenshtein = require("fast-levenshtein");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const Cart = require("../models/Carts");
const upload = require("../middlewares/uploads");
const validatePassword = require("../utils/validatePassword");
const WelcomeEmail = require("../templates/welcomeemail");
const ResetPasswordEmail = require("../templates/resetpasswordemail");
const { passwordExpiredEmail, accountLockedEmail } = require("../templates/securityAlerts");
const logger =require("../utils/logger") // ✅ Winston Audit Logger
const { validationResult } = require("express-validator");//input sanitization

require("dotenv").config();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // limit each IP/email to 3 failed login attempts
  keyGenerator: (req) => req.body.email || req.ip,
  skipSuccessfulRequests: false,
  handler: async (req, res) => {
    const email = req.body.email;

    if (email) {
      const user = await User.findOne({ email });

      if (user) {
        // Set lockUntil for 10 minutes and update loginAttempts
        user.loginAttempts = 3;
        user.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // Lock for 10 minutes
        logger.warn("Account locked", {
          event: "account_locked",
          email,
          ip: req.ip,
          time: new Date()
        });
        //  Save user with updated lockUntil        
        await user.save();

        //  Send lock notification email
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Account Locked - Too Many Login Attempts",
          html: accountLockedEmail(user),
        });
      }
    }
    // Log the brute-force attempt
    logger.warn("Brute-force login attempt blocked", {
      event: "brute_force_blocked",
      email,
      ip: req.ip,
      time: new Date()
    });
    

    return res.status(429).json({
      success: false,
      msg: "Too many login attempts. Your account has been locked for 10 minutes.",
    });
  },
});


// Validation schemas
const userValidationSchema = Joi.object({
  name: Joi.string().trim().max(100),
  email: Joi.string().email().trim().lowercase(),
  password: Joi.string().min(8).required(),
  mobile_no: Joi.string().required(),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  captchaToken: Joi.string().required(),
});

// Create cart function
const createCart = async (user) => {
  try {
    const existing = await Cart.findOne({ user_id: user._id, status: "CART" });
    if (existing) return;
    const last = await Cart.findOne().sort({ _id: -1 });
    const cart_no = last ? last.cart_no + 1 : 1000;
    await Cart.create({ cart_no, user_id: user._id });
  } catch (err) {
    throw err;
  }
};

// Register with OTP
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    const { error } = userValidationSchema.validate(req.body);
    if (error)
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ success: false, msg: error.message });

    const { name, email, mobile_no, password } = req.body;

    if (!validatePassword(password)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        msg: "Password must include uppercase, lowercase, number, symbol & be 8+ chars",
      });
    }

    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(httpStatus.CONFLICT)
        .json({ success: false, msg: "User Already Exists!!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60000);
    const passwordChangedAt = Date.now();
    const passwordHistory = [hashedPassword];

    const user = await User.create({
      name,
      email,
      mobile_no,
      password: hashedPassword,
      passwordChangedAt,
      passwordHistory,
      isVerified: false,
      otp,
      otpExpiry,
    });

    await createCart(user);

    logger.info("User registered", {
      event: "user_register",
      userId: user._id,
      email,
      ip: req.ip,
      time: new Date()
    });
    

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email with OTP",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registration Successful. Welcome!",
      html: WelcomeEmail({ name }),
    });

    res
      .status(httpStatus.OK)
      .json({ success: true, msg: "Registered. OTP sent." });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: err.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.otp || !user.otpExpiry)
      return res.status(400).json({ message: "No OTP request found" });

    const now = new Date();
    if (user.otpExpiry < now)
      return res.status(400).json({ message: "OTP has expired" });

    if (user.otp !== otp.toString())
      return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    logger.info("OTP verified", {
      event: "otp_verified",
      email,
      ip: req.ip,
      time: new Date()
    });
    

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
  
};

// Captcha verify
const verifyCaptcha = async (token) => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
  const res = await axios.post(url);
  return res.data.success;
};

// Login
const login = async (req, res) => {
  try {
    const { error } = loginValidationSchema.validate(req.body);
    if (error)
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ success: false, msg: error.message });

    const { email, password, captchaToken } = req.body;
    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
      logger.warn("CAPTCHA failed", {
        event: "captcha_failed",
        email,
        ip: req.ip,
        time: new Date()
      });
      

      return res
        .status(403)
        .json({ success: false, msg: "CAPTCHA verification failed. Please try again." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("Failed login attempt", {
        email: email,
        reason: "User not found",
        ip: req.ip,
        time: new Date(),
      });

      //  Prevent login if account is currently locked
if (user.lockUntil && user.lockUntil > Date.now()) {
  return res.status(403).json({
    success: false,
    msg: "Your account is locked. Please try again after 10 minutes.",
  });
}
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ success: false, msg: "User Not Registered!!" });
    }

    if (user.role !== "super-admin" && !user.isVerified) {
      return res.status(401).json({ msg: "Please verify your email" });
    }

    const thirtyDays = 1000 * 60 * 60 * 24 * 30;
    const passwordExpired =
      Date.now() - new Date(user.passwordChangedAt).getTime() > thirtyDays;

    if (passwordExpired) {
      logger.warn("Login denied - Password expired", {
        userId: user._id,
        email: email,
        ip: req.ip,
        time: new Date(),
      });

      const resetToken = jwt.sign(
        { user_id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const resetLink = `${process.env.CLIENT_URL || "http://localhost:3001"}/reset-password?token=${resetToken}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Expired - Reset Required",
        html: passwordExpiredEmail(user, resetLink),
      });

      return res.status(403).json({
        success: false,
        msg: "Password expired. Reset link sent to your email.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ success: false, msg: "Incorrect Password" });
    //  Reset loginAttempts & lockUntil after successful login
user.loginAttempts = 0;
user.lockUntil = undefined;
await user.save(); // 

    req.session.regenerate(async (err) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Session error" });
      }

      req.session.userId = user._id; //session creaating
      console.log(" Session created:", req.session.userId);


      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const { password: _, otp, otpExpiry, __v, ...data } = user.toObject();

      await createCart(user);

      // logger.info("User logged in", {
      //   userId: user._id,
      //   email: email,
      //   ip: req.ip,
      //   time: new Date(),
      // });

      return res.status(httpStatus.OK).json({
        success: true,
        msg: "Login Success!!",
        data: { ...data, token },
      });
    });
    logger.info("User logged in", {
      userId: user._id,
      email: email,
      ip: req.ip,
      time: new Date(),
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: err.message });
  }
};
  // All users (with pagination and search)
  const allUser = async (req, res) => {
    try {
      const { page = 1, size = 10, sort = { _id: -1 }, search } = req.query;
      const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
      const users = await User.find(filter).select("name email mobile_no image").skip((page - 1) * size).limit(size).sort(sort);
      const totalCount = await User.countDocuments();
      res.status(httpStatus.OK).json({ success: true, msg: "Users!!", data: users, page, size, totalCount });
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, msg: "Something Went Wrong!!" });
    }
  };

  // My Profile
  const myProfile = async (req, res) => {
    try {
      const { password, __v, createdAt, updatedAt, ...data } = req.user;
      res.status(httpStatus.OK).json({ success: true, msg: "User!!", data });
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, msg: "Something Went Wrong!!" });
    }
  };

  // Update profile
  const updateProfile = async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if (!user) return res.status(httpStatus.NOT_FOUND).json({ success: false, msg: "User Not Registered!!" });
      await User.findByIdAndUpdate(id, req.body, { new: true });
      res.status(httpStatus.OK).json({ success: true, msg: "User Profile Updated!!" });

      logger.info("Profile updated", {
        event: "profile_updated",
        userId: id,
        fieldsChanged: Object.keys(req.body),
        ip: req.ip,
        time: new Date()
      });

      
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, msg: "Something Went Wrong!!" });
    }
  };

  // Upload profile picture
  const uploadPP = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, msg: "No file uploaded or invalid format" });
      }
  
      await User.findByIdAndUpdate(req.user._id, {
        image: req.file.path,
      });
  
      res.status(200).json({
        success: true,
        msg: "Profile Image Updated!!",
        data: { image: req.file.path },
      });
  
    } catch (err) {
      res.status(500).json({
        success: false,
        msg: "Something Went Wrong!!",
        error: err.message,
      });
    }
  };
  
  

  // Reset password request
  const resetPasswordRequest = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).send({ message: "Email is required" });

      const user = await User.findOne({ email });
      if (!user) return res.status(404).send({ message: "User not found" });

      const resetToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const resetLink = `${process.env.CLIENT_URL || "http://localhost:3001"}/reset-password?token=${resetToken}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        html: ResetPasswordEmail({ name: user.name, resetLink })
      });

      res.status(200).send({ message: "Password reset email sent successfully" });

      logger.info("Password reset requested", {
        event: "password_reset_request",
        email,
        ip: req.ip,
        time: new Date()
      });
      

    } catch (err) {
      res.status(500).send({ message: "Error in sending reset email", error: err.message });
    }
  };
  const resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
  
      // Decode JWT token to get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.user_id);
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      //  Step 1: Prevent reuse of last 2 passwords (using bcrypt)
      for (let old of user.passwordHistory.slice(-2)) {
        if (await bcrypt.compare(newPassword, old)) {
          return res.status(400).json({
            message: "You can't reuse your last 2 passwords.",
          });
        }
      }
  
      //  Step 2: Levenshtein distance check against last plain password
      if (user.lastPlainPassword) {
        const distance = levenshtein.get(newPassword, user.lastPlainPassword);
        if (distance < 3) {
          return res.status(400).json({
            message: "New password is too similar to previous password.",
          });
        }
      }
  
      //  Step 3: Hash the new password and update fields
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      user.passwordChangedAt = Date.now();
      user.passwordHistory.push(hashed);
      user.lastPlainPassword = newPassword; // For Levenshtein check
  
      //  Step 4: Keep only last 5 passwords in history
      if (user.passwordHistory.length > 5) {
        user.passwordHistory = user.passwordHistory.slice(-5);
      }
  
      await user.save();

      // Log the password reset event
      logger.info("Password reset successful", {
        event: "password_reset",
        userId: user._id,
        ip: req.ip,
        time: new Date()
      });
      
  
      return res.status(200).json({ message: "Password reset successfully" });

      
  
    } catch (err) {
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  

 

const changePassword = async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;

    //  Fetch user
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // ✅ Validate old password
    const isOldMatch = await bcrypt.compare(oldpassword, user.password);
    if (!isOldMatch) {
      return res.status(401).json({ msg: "Invalid old password" });
    }

    //  Check if new password is in last 2 password history
    for (let oldHash of user.passwordHistory.slice(-2)) {
      if (await bcrypt.compare(newpassword, oldHash)) {
        return res.status(400).json({ msg: "You can't reuse your last 2 passwords" });
      }
    }

    //  Levenshtein distance check with old password
    const distance = levenshtein.get(newpassword, oldpassword);
    if (distance < 3) {
      return res.status(400).json({ msg: "New password is too similar to the old password" });
    }
    //  Hash and store new password
    const hashed = await bcrypt.hash(newpassword, 10);
    user.password = hashed;
    user.passwordChangedAt = Date.now();
    user.passwordHistory.push(hashed);
    user.lastPlainPassword = newpassword; // Store plaintext for Levenshtein use

    //  Keep only last 5 passwords
    if (user.passwordHistory.length > 5) {
      user.passwordHistory = user.passwordHistory.slice(-5);
    }

    //  Add audit log
    logger.info("Password changed", {
      userId: req.user._id,
      ip: req.ip,
      time: new Date()
    });

    await user.save();

    return res.status(200).json({ msg: "Password changed successfully" });
    

  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};



  // Delete user
  const deleteUser = async (req, res) => {
    try {
      const deleted = await User.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
      res.status(httpStatus.OK).json({ success: true, message: "User Deleted Successfully" });
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: err.message });
    }
  };
  // const logout = (req, res) => {
  //   req.session.destroy((err) => {
  //     if (err) {
  //       console.error(" Session destroy error:", err);
  //       return res.status(500).json({ success: false, msg: "Logout failed" });
  //     }
  
  //     console.log("🧼 Session destroyed. Clearing cookie...");
  //     // Clear session cookie
  //     res.clearCookie("connect.sid", {
  //       path: "/",             // must match cookie path
  //       httpOnly: true,        // match cookie settings
  //       sameSite: "Strict",    // match SameSite setting
  //       secure: process.env.NODE_ENV === "production"       // or true if using HTTPS
  //     });
  
  //     return res.status(200).json({ success: true, msg: "Logout successful" });
  //   });
  // };
  


const logout = (req, res) => {
req.session.destroy((err) => {
  if (err) {
    console.error(" Session destroy error:", err);

    //  Log logout failure
    logger.error("Logout failed", {
      userId: req?.session?.user?._id || "Unknown",
      reason: "Session destroy error",
      ip: req.ip,
      time: new Date()
    });

    return res.status(500).json({ success: false, msg: "Logout failed" });
  }

  console.log(" Session destroyed. Clearing cookie...");
  //  Clear session cookie
  res.clearCookie("connect.sid", {
    path: "/",             // must match cookie path
    httpOnly: true,        // match cookie settings
    sameSite: "Strict",    // match SameSite setting
    secure: process.env.NODE_ENV === "production" // or true if using HTTPS
  });

  //  Log successful logout
  logger.info("User logged out", {
    userId: req?.session?.user?._id || "Unknown",
    ip: req.ip,
    time: new Date()
  });

  return res.status(200).json({ success: true, msg: "Logout successful" });
});
};


  // Export all
  module.exports = {
    login,
    register,
    verifyOtp,
    allUser,
    myProfile,
    updateProfile,
    uploadPP,
    changePassword,
    resetPasswordRequest,
    resetPassword,
    deleteUser,
    loginLimiter,
    logout, // if using rate limiter
  };


