const Submission = require("../models/Submission");
const Question = require("../models/Question"); // optional: to validate question exists
const { runSubmission } = require("../utils/codeRunner");

const createSubmission = async (req, res) => {
  try {
    const { questionId, teamId, language = "c", code } = req.body;

    if (!questionId || !code) {
      return res.status(400).json({ success: false, message: "questionId and code are required" });
    }

    const question = await Question.findById(questionId).select("_id testCases");
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const submission = new Submission({
      questionId,
      teamId,
      language,
      code,
      status: "received"
    });

    await submission.save();

    // Run async
    runSubmission(submission._id);

    res.status(201).json({ success: true, submissionId: submission._id });
  } catch (err) {
    console.error("createSubmission error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { createSubmission };
