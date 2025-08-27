const Team = require("../models/Team");
const { sendOTPEmail } = require("../config/emailService");
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
  try {
    const { teamName, otp } = req.body;
    console.log("Received:", { teamName, otp, parsedOtp: parseInt(otp) });

    const team = await Team.findOne({ teamName: teamName });
    console.log("DB result:", team?.teamName, team?.houseName);

    if (!team) {
      return res.status(401).json({ success: false, message: "Team not found" });
    }

    if (team.otp === parseInt(otp)) {
      const payload = {
        teamName: team.teamName,
        houseName: team.houseName,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });

      return res.json({
        success: true,
        message: "Login successful",
        teamName: team.teamName,
        houseName: team.houseName,
        token, // ✅ send token to frontend
      });
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

    const rollNumber = email.slice(0, 6);
    console.log("Extracted rollNumber:", rollNumber);

    const team = await Team.findOne({ "members.rollNumber": rollNumber });
    if (!team) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    return res.json({ success: true, message: "Email verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const otpGen = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.length < 6) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const rollNumber = email.slice(0, 6);
    const team = await Team.findOne({ "members.rollNumber": rollNumber });

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    team.otp = otp;
    await team.save();

    await sendOTPEmail({
      recipientEmail: email,
      recipientName: team.teamName,
      otp,
      subject: "Your OTP for login",
      expiryMinutes: 10,
    });

    return res.json({ success: true, message: "OTP generated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { loginAdmin, emailVerify, otpGen };
