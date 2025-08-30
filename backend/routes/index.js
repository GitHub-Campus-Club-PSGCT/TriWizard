const express = require("express");
const router = express.Router();
const questionRoutes = require("./questions");

const adminRoutes = require("./admin");
const loginRoutes = require("./login");
const emailRoutes = require("./emailRoutes");
const teamRoutes = require("./teamRoutes")

//mount routes
router.use("/admin", adminRoutes);
router.use("/login", loginRoutes);
router.use("/questions", questionRoutes);
router.use("/email", emailRoutes);
router.use("/teams", teamRoutes);

module.exports = router;
