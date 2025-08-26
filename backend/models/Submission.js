const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  input: { type: String },
  expectedOutput: { type: String },
  actualOutput: { type: String },
  passed: { type: Boolean }
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" }, // optional if using teams
  language: { type: String, required: true, enum: ["c", "cpp", "python"], default: "c" },
  code: { type: String, required: true },
  status: { type: String, enum: ["received", "running", "done", "error"], default: "received" },
  results: [resultSchema], // per test-case results
  passedAll: { type: Boolean, default: false },
  error: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Submission", submissionSchema);
