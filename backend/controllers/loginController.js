const Team = require("../models/Team");
const { sendOTPEmail } = require("../config/emailService");
const jwt = require("jsonwebtoken");

const signAuthToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });

const setAuthCookie = (res, token) => {
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 5 * 60 * 60 * 1000, // 5h
  });
};

const loginAdmin = async (req, res) => {
  try {
    const { teamName, otp } = req.body;

    if (!teamName || !otp) {
      return res.status(400).json({ success: false, message: "Missing credentials" });
    }

    const team = await Team.findOne({ teamName: teamName });
    if (!team) {
      return res.status(401).json({ success: false, message: "Team not found" });
    }

    // NOTE: ideally store a timestamp/expiry for OTP, and hash OTP.
    if (String(team.otp) !== String(otp)) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    const payload = { teamName: team.teamName, houseName: team.houseName };
    const token = signAuthToken(payload);

    // set httpOnly cookie
    setAuthCookie(res, token);

    // (optional) clear OTP after successful login
    team.otp = undefined;
    await team.save();

    return res.json({
      success: true,
      message: "Login successful",
      teamName: team.teamName,
      houseName: team.houseName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const emailVerify = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.length < 6) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    const rollNumber = email.slice(0, 6);
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
