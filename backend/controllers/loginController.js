const Team = require("../models/Team");
const { sendOTPEmail } = require("../config/emailService");
const jwt = require("jsonwebtoken");

const signAuthToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });

const setAuthCookie = (res, token) => {
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: false,                
    sameSite: "None",             
    maxAge: 5 * 60 * 60 * 1000,
  });
};

const loginAdmin = async (req, res) => {
  try {
    const { rollNumber, otp } = req.body;

    if (!rollNumber || !otp) {
      return res.status(400).json({ success: false, message: "Missing credentials" });
    }

    const team = await Team.findOne({
      "members.rollNumber": { $regex: new RegExp(`^${rollNumber}$`, "i") }
    });

    if (!team) {
      return res.status(401).json({ success: false, message: "Team not found" });
    }

    if (String(team.otp) !== String(otp)) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    // successful login
    const payload = { teamName: team.teamName, houseName: team.houseName };
    const token = signAuthToken(payload);
    setAuthCookie(res, token);

    // clear OTP after login
    //team.otp = undefined;
    //await team.save();

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

    const rollNumber = email.slice(0, 6).toLowerCase(); // case-insensitive
    const team = await Team.findOne({ 
      "members.rollNumber": { $regex: new RegExp(`^${rollNumber}$`, "i") }
    });

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    team.otp = otp;
    await team.save();

    // send email with OTP
    await sendOTPEmail({
      recipientEmail: email,
      recipientName: team.teamName,
      otp,
      subject: "Your OTP for login",
      expiryMinutes: 10,
    });

    return res.json({
      success: true,
      message: "OTP generated successfully",
      rollNumber // 👈 frontend stores this and sends it back later
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { loginAdmin, emailVerify, otpGen };
