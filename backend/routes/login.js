const express = require("express");
const router = express.Router();
const Team = require("../models/Team");

router.post("/", async (req, res) => {
  try {
    const { teamName, otp } = req.body;
    console.log("Received:", { teamName, otp, parsedOtp: parseInt(otp) });

    //find team by name
    const team = await Team.findOne({ teamName: teamName });

    console.log("Query result:", team);

    //no team found
    if (!team) {
      return res.status(401).json({ success: false, message: "Team not found" });
    }

    //Check OTP
    if (team.otp === parseInt(otp)) {
      return res.json({ success: true, message: "Login successful", team });
    } else {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
