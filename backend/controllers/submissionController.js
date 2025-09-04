const Submission = require("../models/Submission");
const Question = require("../models/Question");
const Team = require("../models/Team");
const axios = require("axios");
const broadcastLeaderboard = require("../index").broadcastLeaderboard;
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
      const response = await axios.post(`${COMPILER_URL}/submit`, requestBody, { timeout: 10000 });
      console.log(response.data); //for debugging purpose
      if (response.data.results) {
        results = response.data.results.map(tc => {
          // Remove all whitespace (spaces, tabs, newlines) for comparison
          const normalize = str => (str || "").replace(/\s+/g, "");
          const expected = normalize(tc.expectedOutput);
          const actual = normalize(tc.actualOutput);
          return {
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: tc.actualOutput,
            passed: expected === actual
          };
        });
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

    // Update Team's testCasesPassed array and score
    if (teamId && question.questionNumber) {
      const team = await Team.findById(teamId);
      if (team) {
        // --- Time-based Score Calculation ---
        const maxPointsPerTestCase = 20;
        const minPointsPerTestCase = 5;
        const decayDurationMs = 3600000; // 1 hour

        // Set start time to today at 10:30 AM
        const startTime = new Date().setHours(16, 20, 0, 0);
        const currentTime = Date.now();

        // Calculate elapsed time, capped at the decay
        const elapsedTimeMs = Math.min(Math.max(0, currentTime - startTime), decayDurationMs);

        // Calculate the decay factor (from 1 down to 0)
        const decayFactor = 1 - (elapsedTimeMs / decayDurationMs);

        // Apply linear decay to points
        const pointsPerTestCase = minPointsPerTestCase + (maxPointsPerTestCase - minPointsPerTestCase) * decayFactor;

        // --- Original Logic with Updated Scoring ---
        while (team.testCasesPassed.length < 7) {
          team.testCasesPassed.push(0);
        }

        const qnIdx = question.questionNumber - 1;
        const oldTestcasesPassed = team.testCasesPassed[qnIdx] || 0;

        team.testCasesPassed[qnIdx] = Math.max(oldTestcasesPassed, testcasesPassed);

        // Calculate score gain using the new time-dependent points
        const newTestsPassedCount = Math.max(0, testcasesPassed - oldTestcasesPassed);
        const scoreGain = Math.round(newTestsPassedCount * pointsPerTestCase);
        console.log(`Score gain : ${scoreGain}`);

        team.score = (team.score || 0) + scoreGain;

        await team.save();

        //broadcastLeaderboard();
      }
    }

    res.status(201).json({ success: true, submission, testcasesPassed, testcasesTotal: question.testCases.length });
  } catch (err) {
    console.error("createSubmission error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { createSubmission };
