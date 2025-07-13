const { check } = require("express-validator");

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const { verifyUser, verifyAuthorization } = require("../middlewares/authMiddlerware");
const { verifyOtp } = require('../controllers/userControllers');
const { logout } = require('../controllers/userControllers');
const upload = require('../middlewares/uploads'); 
router.post("/login", userController.loginLimiter, userController.login)
router.post(
    '/register',
    [
      check("name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Name is required"),
      check("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid email"),
      check("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
      check("mobile_no")
        .isMobilePhone()
        .withMessage("Invalid mobile number"),
    ],
    userController.register
  );
  
  
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);

router.get('/all', verifyUser, verifyAuthorization, userController.allUser)

router.get('/my-profile', verifyUser, userController.myProfile)

router.put('/update-profile/:id', verifyUser, userController.updateProfile)

router.put('/upload-pp', verifyUser, upload.single('profileImage'), userController.uploadPP)


router.put('/change-password', verifyUser, userController.changePassword)
router.post("/reset-password-request", userController.resetPasswordRequest)
router.post("/reset-password", userController.resetPassword)

router.delete('/delete-user/:id', verifyUser, verifyAuthorization, userController.deleteUser)


module.exports = router
