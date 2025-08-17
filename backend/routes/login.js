const express = require("express");
const { loginAdmin, emailVerify, otpGen } = require("../controllers/loginController");

const router = express.Router();

// Admin login via OTP
router.post("/otp-verify", loginAdmin);

// Email verification
router.post("/email-verify", emailVerify);

router.post("/otp-gen", otpGen);

module.exports = router;
