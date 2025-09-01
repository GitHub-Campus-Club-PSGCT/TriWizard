const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

// Create Team
router.post("/", teamController.createTeam);
// Update House by Roll Number
router.post("/house", teamController.updateHouseByRollNumber);
// Get Teams by House
router.get("/house/:houseName", teamController.getTeamsByHouse);
router.post("/score-change", teamController.updateTeamScoreByRollNumber);
router.post("/teamid", teamController.getTeamIdByEmail);
module.exports = router;
