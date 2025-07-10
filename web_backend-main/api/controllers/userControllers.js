const Joi = require("joi");
const User = require("../models/User");
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const upload = require("../middlewares/uploads");
const Cart = require("../models/Carts");
require("dotenv").config();
const WelcomeEmail = require("../templates/welcomeemail");  
const ResetPasswordEmail = require("../templates/resetpasswordemail");

const userValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  mobile_no: Joi.string().required(),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const createCart = async (user) => {
  try {
    //check if active cart exists
    const activeCart = await Cart.findOne({
      user_id: user._id,
      status: "CART"
    });
    if (activeCart) return;

    //get cart_no 
    const result = await Cart.findOne({}).sort({ _id: -1 });
    const cart_no = result ? result.cart_no + 1 : 1000;

    const cart = await Cart.create({ cart_no, user_id: user._id });
  } catch (error) {
    throw error;
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = loginValidationSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        msg: error.message
      });
    }
    const user = await User.findOne({
      email: req.body.email
    }).lean();

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        msg: "User Not Registered!!"
      });
    }

    // check if password is valid
    const checkPassword = await bcrypt.compare(req.body.password, user.password);
    if (!checkPassword) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        msg: "Email or Password Incorrect!!"
      });
    }

    // generate and send a JWT token for the authenticated user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const { password, __v, ...data } = user;

    //create cart for the user
    await createCart(user);

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "Login Success!!",
      data: {
        ...(data),
        token
      }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message
    });
  }
};

const register = async (req, res, next) => {
  try {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        msg: error.message
      });
    }

    const checkUserExist = await User.findOne({ email: req.body.email });
    if (checkUserExist) {
      return res.status(httpStatus.CONFLICT).json({
        success: false,
        msg: "User Already Exists!!"
      });
    }

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = await User.create({ ...req.body, password: hashedPassword });

    if (!user) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        msg: "Failed to Register!!"
      });
    }

    // Create user's cart
    await createCart(user);

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      }
    });

    // Send Welcome Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Registration Successful. Welcome!",
      html: WelcomeEmail({ name: user.name }),
    };

    await transporter.sendMail(mailOptions);

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "Registration Completed"
    });

  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message
    });
  }
};
const allUser = async (req, res, next) => {
  try {
    const { page = 1, size = 10, sort =
      { _id: -1 } } = req.query;

    let searchQuery = {};

    if (req.query.search) {
      searchQuery = {
        ...searchQuery,
        name: { $regex: req.query.search, $options: 'i' }
      };
    }

    const users = await User.find(searchQuery).select("name email mobile_no image").skip((page - 1) * size).limit(size).sort(sort);

    const totalCount = await User.countDocuments();
    return res.status(httpStatus.OK).json({
      success: true,
      msg: "Users!!",
      data: users,
      page,
      size,
      totalCount
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Something Went Wrong!!"
    });
  }
};

const myProfile = async (req, res, next) => {
  try {
    const { password, role, createdAt, updatedAt, __v, ...data } = req.user;
    return res.status(httpStatus.OK).json({
      success: true,
      msg: "User!!",
      data: data
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Something Went Wrong!!"
    });
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        msg: "User Not Registered!!"
      });
    }

    await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "User Profile Updated!!"
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Something Went Wrong!!"
    });
  }
};

const uploadPP = async (req, res) => {
  upload.single('image')(req, res, async error => {
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        msg: error.message
      });
    }
    try {
      console.log("req.file", req.file);
      await User.findByIdAndUpdate(req.user._id, {
        image: req.file ? req.file.path : ''
      });
      return res.status(httpStatus.OK).json({
        success: true,
        msg: "Profile Image Updated!!",
        data: {
          image: req.file ? req.file.path : ''
        }
      });
    } catch (error) {
      console.log("error", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        msg: "Something Went Wrong!!"
      });
    }
  });
};
 // Import the email template

const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Generate a reset token (expires in 1 hour)
        const resetToken = jwt.sign(
            { user_id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Construct reset link
        const clientUrl = process.env.CLIENT_URL || "http://localhost:3001";
        const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        // Send Reset Email using the template
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: ResetPasswordEmail({ name: user.name, resetLink }), // Using the template
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: "Password reset email sent successfully" });
    } catch (error) {
        console.error("❌ Error sending reset email:", error);
        res.status(500).send({ message: "Error in sending reset email", error: error.message });
    }
};

const resetPassword = async (req, res) => {
  try {
      const { token, newPassword } = req.body;

      console.log("🔹 Received Token for Reset:", token);  // Debuggcling Step

      // ✅ Verify the reset token
      let decoded;
      try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
          console.error("❌ Token Verification Error:", error.message);
          return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      console.log("🔹 Decoded Token:", decoded);

      // ✅ Find the user associated with the token
      const user = await User.findById(decoded.user_id);
      if (!user) {
          console.error("❌ User Not Found");
          return res.status(404).json({ message: "User not found" });
      }

      console.log("🔹 User Found:", user.email);

      // ✅ Ensure new password is provided
      if (!newPassword || newPassword.length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      // ✅ Hash the new password before saving (Same as in Registration)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // ✅ Set new password
      user.password = hashedPassword;
      await user.save();

      console.log("✅ Password Updated Successfully in Database!");

      return res.status(200).json({ message: "Password reset successfully. You can now log in with your new password." });
  } catch (error) {
      console.error("❌ Error resetting password:", error);
      return res.status(500).json({ message: "Server error", error });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;

    //check if old password matches
    const checkPassword = await bcrypt.compare(oldpassword, req.user.password);
    if (!checkPassword) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        msg: "Invalid Credential!!"
      });
    }
    bcrypt.genSalt(10, async (error, salt) => {
      bcrypt.hash(newpassword, salt, async (error, hash) => {
        await User.findByIdAndUpdate(req.user._id, {
          password: hash
        }, { new: true });
      });
    });
    return res.status(httpStatus.OK).json({
      success: true,
      msg: "Password Changed!!"
    });
  } catch (error) {
    console.log("error", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Something Went Wrong!!"
    });
  }
};

// delete user
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    // console.log(deletedUser);

    if (!deletedUser) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    return res.status(httpStatus.OK).json({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

module.exports = {
  login,
  register,
  allUser,
  myProfile,
  updateProfile,
  uploadPP,
  changePassword,
  deleteUser,
  createCart,
  resetPasswordRequest,
  resetPassword
  
};
