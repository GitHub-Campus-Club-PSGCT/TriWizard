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
exports.createTeam = async (req, res) => {
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
      houseName,
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
