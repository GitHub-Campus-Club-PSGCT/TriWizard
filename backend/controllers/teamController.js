// controllers/teamController.js
const Team = require("../models/Team");
const Counter = require("../models/Counter");

// Get next teamId
const getNextTeamId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "teamId" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return counter.value;
};

// Create Team
const createTeam = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const { teamName, members, houseName } = req.body;

    if (!teamName || !members || !houseName) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const teamId = await getNextTeamId();

    const newTeam = new Team({
      teamId,
      teamName,
      members,
      houseName: "unknown",
      otp: null,
      testCasesPassed: [],
      score: null
    });

    await newTeam.save();
    res.status(201).json({ success: true, data: newTeam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Update House by Roll Number
const updateHouseByRollNumber = async (req, res) => {
  try {
    const { rollNumber, houseName } = req.body;

    if (!rollNumber || !houseName) {
      return res.status(400).json({ success: false, message: "Roll number and house name are required" });
    }

    // Find the team containing the roll number
    const team = await Team.findOne({ "members.rollNumber": rollNumber });

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found for this roll number" });
    }

    // Update houseName
    team.houseName = houseName;
    await team.save();

    res.json({ success: true, message: `House updated to ${houseName} for team ${team.teamName}`, team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Teams by House Name
const getTeamsByHouse = async (req, res) => {
  try {
    const { houseName } = req.params;

    if (!houseName) {
      return res.status(400).json({ success: false, message: "House name is required" });
    }

    const teams = await Team.find({
      houseName: { $regex: new RegExp(`^${houseName}$`, "i") },
    }).select("teamName score houseName");

    if (!teams || teams.length === 0) {
      return res.status(404).json({ success: false, message: "No teams found for this house" });
    }

    return res.json({
      success: true,
      houseName,
      teams,
    });
  } catch (err) {
    console.error("Error fetching teams:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 👇 Export ALL
module.exports = { createTeam, updateHouseByRollNumber, getTeamsByHouse };
