const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  rollNumber: String,
  name: String
});

const teamSchema = new mongoose.Schema({
  teamId: { type: Number, unique: true }, // auto-generated
  teamName: { type: String, required: true },
  members: [memberSchema],
  otp: { type: Number, default: null },
  testCasesPassed: { type: [Number], default: [] },
  score: { type: Number, default: null },
  houseName: { type: String, required: true }
});

module.exports = mongoose.model("Team", teamSchema);
