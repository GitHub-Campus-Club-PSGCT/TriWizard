const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// OTP Schema
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true }
});

const Otp = mongoose.model("Otp", otpSchema);

// Route: Generate OTP & Save to DB
router.post("/generate", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.create({ email, otp });

  res.json({ success: true });
});

module.exports = router;
