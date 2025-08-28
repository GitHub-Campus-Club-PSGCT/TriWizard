const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach verified claims to request
    req.user = decoded;
    req.teamName = decoded.teamName;
    req.houseName = decoded.houseName;

    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { authMiddleware };
