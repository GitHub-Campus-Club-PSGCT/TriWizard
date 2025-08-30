const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const Question = require("../models/Question");

// POST /run-code/:questionNumber
router.post("/run-code/:questionNumber", async (req, res) => {
  try {
    const { questionNumber } = req.params;
    const { code } = req.body;

    const question = await Question.findOne({ questionNumber });
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    // temp file
    const filePath = path.join(__dirname, "..\\temp\\solution.c");
    fs.writeFileSync(filePath, code);

    exec(`docker run --rm -v ${dockerPath}:\\app/solution.c gcc sh -c "gcc \\app/solution.c -o \\app/solution && \\app/solution"`, 
      (error, stdout, stderr) => {
        if (error) {
          return res.json({ success: false, error: stderr || error.message });
        }

        const results = question.testCases.map(tc => {
          const actual = stdout.trim();
          return {
            input: tc.input,
            expected: tc.expectedOutput,
            actual,
            passed: actual === tc.expectedOutput
          };
        });

        res.json({ success: true, results });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
