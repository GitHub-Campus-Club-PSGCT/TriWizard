// config/emailservice.js
const nodemailer = require("nodemailer");
require("dotenv").config(); // load env vars

// Use environment variables instead of hardcoding
const transporter = nodemailer.createTransport({
  service: "gmail", // or "outlook", "smtp", etc.
  auth: {
    user: process.env.EMAIL_USER,  // ✅ stored in .env
    pass: process.env.EMAIL_PASS   // ✅ stored in .env
  }
});

// Send OTP email
const sendOTPEmail = async ({ recipientEmail, recipientName, otp, subject, expiryMinutes }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject || "Your OTP Code",
      text: `Hello Team "${recipientName}",\n\nYour OTP is: ${otp}. It expires in ${expiryMinutes || 10} minutes.\n\n- GHCC`
    };


    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      recipientEmail,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Test email configuration
const testEmailConfiguration = async (testEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: testEmail,
      subject: "Test Email",
      text: "This is a test email to check configuration."
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      recipientEmail: testEmail,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = { sendOTPEmail, testEmailConfiguration };
