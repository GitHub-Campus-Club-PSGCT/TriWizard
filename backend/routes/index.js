const express = require("express");
const router = express.Router();

const adminRoutes = require("./admin");
const loginRoutes = require("./login");
const otpRoutes = require("./otp");

// mount routes
router.use("/admin", adminRoutes);
router.use("/login", loginRoutes);
router.use("/otp", otpRoutes);

module.exports = router;
