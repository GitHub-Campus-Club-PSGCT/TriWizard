const { execSync, exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const Submission = require("../models/Submission");
const Question = require("../models/Question");

const RUN_DIR = path.join(__dirname, "../../temp");

// Ensure temp dir exists
if (!fs.existsSync(RUN_DIR)) {
  fs.mkdirSync(RUN_DIR);
}

async function runSubmission(submissionId) {
  const submission = await Submission.findById(submissionId);
  if (!submission) throw new Error("Submission not found");

  const question = await Question.findById(submission.questionId);
  if (!question) throw new Error("Question not found");

  // Update status → running
  submission.status = "running";
  await submission.save();

  const codeFile = path.join(RUN_DIR, `code_${submissionId}.c`);
  fs.writeFileSync(codeFile, submission.code);

  let results = [];
  let passedAll = true;

  try {
    // Compile inside docker
    const dockerImage = "gcc:latest";
    const exeFile = `/app/code_${submissionId}`;
    execSync(
      `docker run --rm -v ${RUN_DIR}:/app ${dockerImage} sh -c "gcc /app/code_${submissionId}.c -o ${exeFile}"`,
      { stdio: "inherit" }
    );

    // Run each test case
    for (const tc of question.testCases) {
      let actualOutput = "";
      try {
        actualOutput = execSync(
          `docker run --rm -i -v ${RUN_DIR}:/app ${dockerImage} sh -c "${exeFile}"`,
          { input: tc.input, timeout: 3000 }
        )
          .toString()
          .trim();
      } catch (err) {
        actualOutput = "Runtime Error";
      }

      const passed = actualOutput === tc.expectedOutput.trim();
      if (!passed) passedAll = false;

      results.push({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput,
        passed,
      });
    }

    submission.status = "done";
    submission.results = results;
    submission.passedAll = passedAll;
    submission.error = null;
  } catch (err) {
    submission.status = "error";
    submission.error = err.message;
  }

  await submission.save();
}

module.exports = { runSubmission };
