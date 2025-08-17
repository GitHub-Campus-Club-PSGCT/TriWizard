const express = require("express");
const router = express.Router();
const Team = require("../models/Team");

// POST /api/otp
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.length < 6) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // Extract roll number from email
    const rollNumber = email.slice(0, 6);

    // Find the team containing this member
    const team = await Team.findOne({ "members.rollNumber": rollNumber });

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP in the team document
    team.otp = otp;
    await team.save();

    // OTP is stored in DB; frontend doesn't see it
    return res.json({ success: true, message: "OTP generated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

