const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboardController");

const router = express.Router();

// GET /api/leaderboard - Get current leaderboard data
router.get("/", getLeaderboard);

module.exports = router;
