const Submission = require("../models/Submission");
const Question = require("../models/Question");
const Team = require("../models/Team");
const axios = require("axios");
require("dotenv").config();

const COMPILER_URL = process.env.COMPILER_URL;
const createSubmission = async (req, res) => {
  try {
    const { questionId, teamId, language = "c", code } = req.body;

    if (!questionId || !code) {
      return res.status(400).json({ success: false, message: "questionId and code are required" });
    }

  const question = await Question.findById(questionId).select("_id testCases questionNumber");
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    // Check for existing submission for this team and question
    let submission = await Submission.findOne({ teamId, questionId });
    if (submission) {
      // Update existing submission
      submission.language = language;
      submission.code = code;
      submission.status = "received";
      submission.results = [];
      submission.passedAll = false;
      submission.error = null;
      await submission.save();
    } else {
      // Create new submission
      submission = new Submission({
        questionId,
        teamId,
        language,
        code,
        status: "received"
      });
      await submission.save();
    }

    // Prepare request body for remote compiler
    const requestBody = {
      code,
      testCases: question.testCases,
      submissionid: submission._id.toString()
    };

  let results = [];
  let passedAll = true;
  let error = null;
  let testcasesPassed = 0;

    try {
      const response = await axios.post(COMPILER_URL, requestBody, { timeout: 10000 });
      if (response.data.results) {
        results = response.data.results.map(tc => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: tc.actualOutput,
          passed: tc.passed
        }));
        testcasesPassed = results.filter(r => r.passed).length;
        passedAll = results.every(r => r.passed);
        submission.status = "done";
        submission.results = results;
        submission.passedAll = passedAll;
        submission.error = null;
      } else if (response.data.error) {
        submission.status = "error";
        submission.error = response.data.error;
        submission.results = [];
        submission.passedAll = false;
      }
    } catch (err) {
      submission.status = "error";
      submission.error = err.response?.data?.error || err.message;
      submission.results = [];
      submission.passedAll = false;
    }

  await submission.save();

  // Update Team's testCasesPassed array
  if (teamId && question.questionNumber) {
    const team = await Team.findById(teamId);
    if (team) {
      // Ensure testCasesPassed array is size 7
      while (team.testCasesPassed.length < 7) team.testCasesPassed.push(0);
      const qnIdx = question.questionNumber - 1;
      team.testCasesPassed[qnIdx] = Math.max(team.testCasesPassed[qnIdx], testcasesPassed);
      await team.save();
    }
  }

  res.status(201).json({ success: true, submission, testcasesPassed, testcasesTotal: question.testCases.length });
  } catch (err) {
    console.error("createSubmission error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { createSubmission };
