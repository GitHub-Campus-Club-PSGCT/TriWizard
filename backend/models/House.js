const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
  houseName: {
    type: String,
    required: true,
    unique: true
  },
  questionIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    }
  ]
});

module.exports = mongoose.model("House", houseSchema);
