const express = require("express");
const router = express.Router();

const adminRoutes = require("./admin");
//const emailVerificationRoutes = require("./emailVerification.js");
const loginRoutes = require("./login");
//const otpRoutes = require("./otp");

//mount routes
router.use("/admin", adminRoutes);
//router.use("/email-verification", emailVerificationRoutes);
router.use("/login", loginRoutes);
//router.use("/otp", otpRoutes);

module.exports = router;
