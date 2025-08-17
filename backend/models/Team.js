const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamId: Number,
  teamName: String,
  members: [
    {
      rollNumber: String,
      name: String
    }
  ],
  otp: Number,
  houseId: String
});

module.exports = mongoose.model("Team", teamSchema, "teams");
