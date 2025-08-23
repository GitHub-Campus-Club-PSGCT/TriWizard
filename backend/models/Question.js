const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  buggedCode: {
    type: String,
    required: true
  },
  testCases: [
    {
      input: { type: String, required: true },
      expectedOutput: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model("Question", questionSchema);
