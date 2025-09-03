const Team = require("../models/Team");

// Get leaderboard data for all houses
const getLeaderboard = async (req, res) => {
  try {
    const allTeams = await Team.find({});
    const houses = {};

    // Group teams by house
    allTeams.forEach(team => {
      if (!houses[team.houseName]) houses[team.houseName] = [];
      houses[team.houseName].push({ 
        name: team.teamName, 
        score: team.score || 0 
      });
    });

    // Convert to array format
    const houseArray = Object.keys(houses).map(houseName => ({
      houseName,
      teams: houses[houseName].sort((a, b) => b.score - a.score) // Sort teams by score descending
    }));

    res.json({
      success: true,
      data: houseArray,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching leaderboard"
    });
  }
};

module.exports = { getLeaderboard };
