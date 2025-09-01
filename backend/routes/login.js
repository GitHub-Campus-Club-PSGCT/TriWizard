const express = require("express");
const { loginAdmin, emailVerify, otpGen } = require("../controllers/loginController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/otp-gen", otpGen);
router.post("/email-verify", emailVerify);
router.post("/otp-verify", loginAdmin);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
     user: {houseName: req.houseName },
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
