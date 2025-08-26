const express = require("express");
const router = express.Router();
const questionRoutes = require("./questions");

const adminRoutes = require("./admin");
const loginRoutes = require("./login");
const emailRoutes = require("./emailRoutes");

//mount routes
router.use("/admin", adminRoutes);
router.use("/login", loginRoutes);
router.use("/questions", questionRoutes);
router.use("/email", emailRoutes);

module.exports = router;
