const express = require("express");

const {
  registerUser,
  loginUser,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  forgotPassword,
  verifyPasswordResetOTP,
  resetPassword
} = require("../controllers/authController");


const router =
  express.Router();


// ===============================
// REGISTER
// ===============================

router.post(
  "/register",
  registerUser
);


// ===============================
// VERIFY REGISTRATION OTP
// ===============================

router.post(
  "/verify-registration-otp",
  verifyRegistrationOTP
);


// ===============================
// RESEND REGISTRATION OTP
// ===============================

router.post(
  "/resend-registration-otp",
  resendRegistrationOTP
);


// ===============================
// LOGIN
// ===============================

router.post(
  "/login",
  loginUser
);


// ===============================
// FORGOT PASSWORD
// ===============================

router.post(
  "/forgot-password",
  forgotPassword
);


// ===============================
// VERIFY PASSWORD RESET OTP
// ===============================

router.post(
  "/verify-reset-otp",
  verifyPasswordResetOTP
);


// ===============================
// RESET PASSWORD
// ===============================

router.post(
  "/reset-password",
  resetPassword
);


module.exports = router;