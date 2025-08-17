const Team = require("../models/Team");

const loginAdmin = async (req, res) => {
  try {
    const { teamName, otp } = req.body;
    console.log("Received:", { teamName, otp, parsedOtp: parseInt(otp) });

    const team = await Team.findOne({ teamName: teamName });
    console.log("Query result:", team);

    if (!team) {
      return res.status(401).json({ success: false, message: "Team not found" });
    }

    if (team.otp === parseInt(otp)) {
      return res.json({ success: true, message: "Login successful", team });
    } else {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const emailVerify = async (req, res) => {
    try {
    const { email } = req.body;
    console.log("Received email:", email);

    if (!email || email.length < 6) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    // Extract roll number from first 6 characters of email
    const rollNumber = email.slice(0, 6);
    console.log("Extracted rollNumber:", rollNumber);

    // Check if roll number exists in any team's members
    const team = await Team.findOne({ "members.rollNumber": rollNumber });
    console.log("Query result:", team);

    if (!team) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    // Roll nuumber is valid, proceed with email verification
    return res.json({ success: true, message: "Email verified" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

const otpGen = async (req, res) => {
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
}

module.exports = { loginAdmin, emailVerify, otpGen };
