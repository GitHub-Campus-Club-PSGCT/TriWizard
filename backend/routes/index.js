const express = require("express");
const router = express.Router();

const adminRoutes = require("./admin");
const loginRoutes = require("./login");

// mount routes
router.use("/admin", adminRoutes);
router.use("/login", loginRoutes);

module.exports = router;
