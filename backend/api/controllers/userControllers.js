// Required modules
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
require("dotenv").config();


const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit 5 login attempts per email
  keyGenerator: (req) => req.body.email || req.ip,
  skipSuccessfulRequests: false,
  handler: async (req, res) => {
    const email = req.body.email;
    if (email) {
      const user = await User.findOne({ email });
      if (user) {
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

    return res.status(429).json({
      success: false,
      msg: "Too many login attempts. Your account has been locked for 10 minutes.",
    });
  },
});

// Validation schemas
const userValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  mobile_no: Joi.string().required(),
});
const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  captchaToken: Joi.string().required()
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
    const { error } = userValidationSchema.validate(req.body);
    if (error) return res.status(httpStatus.BAD_REQUEST).json({ success: false, msg: error.message });

    const { name, email, mobile_no, password } = req.body;
    if (!validatePassword(password)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        msg: "Password must include uppercase, lowercase, number, symbol & be 8+ chars"
      });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(httpStatus.CONFLICT).json({ success: false, msg: "User Already Exists!!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60000);

    const passwordChangedAt = Date.now();
    const passwordHistory = [hashedPassword];

    const user = await User.create({ name, email, mobile_no, password: hashedPassword, passwordChangedAt, passwordHistory, isVerified: false, otp, otpExpiry });
    await createCart(user);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email with OTP",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registration Successful. Welcome!",
      html: WelcomeEmail({ name })
    });

    res.status(httpStatus.OK).json({ success: true, msg: "Registered. OTP sent." });

  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, msg: err.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "No OTP request found" });
    }

    const now = new Date();
    if (user.otpExpiry < now) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (user.otp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });

  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const verifyCaptcha = async (token) => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
  const res = await axios.post(url);
  return res.data.success;
};
const login = async (req, res) => {
  try {
    // ✅ Step 1: Validate request body
    const { error } = loginValidationSchema.validate(req.body);
    if (error) return res.status(httpStatus.BAD_REQUEST).json({ success: false, msg: error.message });

    const { email, password, captchaToken } = req.body;

    // ✅ Step 2: Verify CAPTCHA token
    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
      return res.status(403).json({ success: false, msg: "CAPTCHA verification failed. Please try again." });
    }

    // ✅ Step 3: Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ success: false, msg: "User Not Registered!!" });

    // ✅ Step 4: Check if email is verified
    if (user.role !== "super-admin" && !user.isVerified) {
      return res.status(401).json({ msg: "Please verify your email" });
    }
    

    // ✅ Step 5: Check for password expiry (e.g., 30 days)
    const thirtyDays = 1000 * 60 * 60 * 24 * 30;
    const passwordExpired = Date.now() - new Date(user.passwordChangedAt).getTime() > thirtyDays;

    if (passwordExpired) {
      // Send reset email if password is expired
      const resetToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const resetLink = `${process.env.CLIENT_URL || "http://localhost:3001"}/reset-password?token=${resetToken}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Expired - Reset Required",
        html: passwordExpiredEmail(user, resetLink)
      });

      return res.status(403).json({ success: false, msg: "Password expired. Reset link sent to your email." });
    }

    // ✅ Step 6: Regenerate session to prevent session fixation
    req.session.regenerate(async (err) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Session error" });
      }

      // ✅ Step 7: Store user ID in session (for session-based access)
      req.session.userId = user._id;

      // ✅ Step 8: Also issue JWT token (for frontend auth/token-based API use)
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // ✅ Step 9: Clean up user object before sending
      const { password: _, otp, otpExpiry, __v, ...data } = user.toObject();

      // ✅ Step 10: Create a cart for user if doesn't exist
      await createCart(user);

      // ✅ Step 11: Send both session + JWT to client
      res.status(httpStatus.OK).json({
        success: true,
        msg: "Login Success!!",
        data: { ...data, token }
      });
    });

  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, msg: err.message });
  }
};


// Login
// const login = async (req, res) => {
//   try {
//     const { error } = loginValidationSchema.validate(req.body);
//     if (error) return res.status(httpStatus.BAD_REQUEST).json({ success: false, msg: error.message });

//     const { email, password, captchaToken } = req.body;

//     // ✅ CAPTCHA check
//     const isCaptchaValid = await verifyCaptcha(captchaToken);
//     if (!isCaptchaValid) {
//       return res.status(403).json({ success: false, msg: "CAPTCHA verification failed. Please try again." });
//     }
//     const user = await User.findOne({ email });
//     if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ success: false, msg: "User Not Registered!!" });

//     if (!user.isVerified) return res.status(httpStatus.UNAUTHORIZED).json({ success: false, msg: "Please verify your email." });


//     // ✅ Password expiry check
//     const thirtyDays = 1000 * 60 * 60 * 24 * 30;
//     const passwordExpired = Date.now() - new Date(user.passwordChangedAt).getTime() > thirtyDays;

//     if (passwordExpired) {
//       const resetToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       const resetLink = `${process.env.CLIENT_URL || "http://localhost:3001"}/reset-password?token=${resetToken}`;

//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
//       });

//       await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: "Password Expired - Reset Required",
//         html: passwordExpiredEmail(user, resetLink)
//       });

//       return res.status(403).json({ success: false, msg: "Password expired. Reset link sent to your email." });
//     }
  
//       const token = jwt.sign(
//         { userId: user._id, role: user.role }, // <-- include role
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//       );
  
//       const { password: _, otp, otpExpiry, __v, ...data } = user.toObject();
//       await createCart(user);
  
//       res.status(httpStatus.OK).json({ success: true, msg: "Login Success!!", data: { ...data, token } });
//       } catch (err) {
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, msg: err.message });
//       }
//     }; // <-- Closing brace for login function added
  
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
      } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, msg: "Something Went Wrong!!" });
      }
    };

    // Upload profile picture
    const uploadPP = async (req, res) => {
      upload.single('image')(req, res, async error => {
        if (error) {
          return res.status(httpStatus.BAD_REQUEST).json({ success: false, msg: error.message });
        }
        try {
          await User.findByIdAndUpdate(req.user._id, { image: req.file?.path || '' });
          res.status(httpStatus.OK).json({ success: true, msg: "Profile Image Updated!!", data: { image: req.file?.path || '' } });
        } catch (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, msg: "Something Went Wrong!!" });
        }
      });
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

      } catch (err) {
        res.status(500).send({ message: "Error in sending reset email", error: err.message });
      }
    };

    /// Reset password
    const resetPassword = async (req, res) => {
      try {
        const { token, newPassword } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user_id);

        if (!user) return res.status(404).json({ message: "User not found" });

        for (let old of user.passwordHistory.slice(-2)) {
          if (await bcrypt.compare(newPassword, old)) {
            return res.status(400).json({ message: "You can't reuse your last 2 passwords." });
          }
        }

        // Optional: compare Levenshtein distance from current password (if stored in session/plain)
        const distance = levenshtein.get(newPassword, user.lastPlainPassword || "");
        if (user.lastPlainPassword && distance < 3) {
          return res.status(400).json({ message: "New password is too similar to previous password." });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        user.passwordChangedAt = Date.now();
        user.passwordHistory.push(hashed);

        if (user.passwordHistory.length > 5) {
          user.passwordHistory = user.passwordHistory.slice(-5);
        }

        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
      } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
      }
    };

    // Change password
    const changePassword = async (req, res) => {
      try {
        const { oldpassword, newpassword } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const isOldMatch = await bcrypt.compare(oldpassword, user.password);
        if (!isOldMatch) {
          return res.status(401).json({ msg: "Invalid old password" });
        }

        // ❗ Check against last 2 password hashes
        for (let oldHash of user.passwordHistory.slice(-2)) {
          if (await bcrypt.compare(newpassword, oldHash)) {
            return res.status(400).json({ msg: "You can't reuse your last 2 passwords" });
          }
        }

        // ✅ Levenshtein distance check
        const distance = levenshtein.get(newpassword, oldpassword);
        if (distance < 3) {
          return res.status(400).json({ msg: "New password is too similar to the old password" });
        }

        // ✅ Hash and update
        const hashed = await bcrypt.hash(newpassword, 10);
        user.password = hashed;
        user.passwordChangedAt = Date.now();
        user.passwordHistory.push(hashed);

        // Limit history to last 5 (optional)
        if (user.passwordHistory.length > 5) {
          user.passwordHistory = user.passwordHistory.slice(-5);
        }

        await user.save();
        res.status(200).json({ msg: "Password changed successfully" });
      } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
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
    const logout = (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          console.error("❌ Session destroy error:", err);
          return res.status(500).json({ success: false, msg: "Logout failed" });
        }
    
        console.log("🧼 Session destroyed. Clearing cookie...");
        // ✅ Clear session cookie
        res.clearCookie("connect.sid", {
          path: "/",             // must match cookie path
          httpOnly: true,        // match cookie settings
          sameSite: "Strict",    // match SameSite setting
          secure: process.env.NODE_ENV === "production"       // or true if using HTTPS
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
    // End of userControllers.js