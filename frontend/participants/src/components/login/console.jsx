import "../../components-css/WizardIDE.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function WizardIDE() {
  const { housename, questionNumber } = useParams();
  const [theme, setTheme] = useState("");
  const [code, setCode] = useState("// Loading question...");
  const [output, setOutput] = useState("Result will appear here...");
  const [testCases, setTestCases] = useState([]);
  const [questionId, setQuestionId] = useState(null); // ✅ store questionId
  const [teamId, setTeamId] = useState(null);
  const [testCasesPassed, setTestCasesPassed] = useState(0);
  const [testCasesTotal, setTestCasesTotal] = useState(0);
  const [submissionResults, setSubmissionResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false); // ✅ Loading state for run button
  const [isSubmittedCode, setIsSubmittedCode] = useState(false); // ✅ Track if showing submitted code
  const [questionDescription, setQuestionDescription] = useState(""); // ✅ Store question description
  const navigate = useNavigate();

  const handleEditorDidMount = (editor, monaco) => {
    editor.onDidPaste((e) => {
      const newText = "🐍 “No Parseltongue shortcuts here… type it out, wizard!”";
      const edit = {
        range: e.range,
        text: newText,
        forceMoveMarkers: true
      };
      // This executes after the paste, replacing the pasted content.
      editor.executeEdits("paste-blocker", [edit]);
    });
  };

  // 🔹 Number-to-theme mapping
  const themeMap = {
    "1": "Gryffindor",
    "2": "Hufflepuff",
    "3": "Ravenclaw",
    "4": "Slytherin",
  };
  useEffect(() => {
    const fetchTeamId = async () => {
      const email = localStorage.getItem("email"); // ✅ get email from auth
      if (!email) return;

      try {
        const res = await fetch(`${API_URL}/admin/teamid`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data.success && data.teamId) {
          setTeamId(data.teamId);
        }
      } catch (err) {
        console.error("Failed to fetch teamId:", err);
      }
    };

    fetchTeamId();
  }, []);

  // 🔹 Function to reset to original buggy code
  const resetToOriginalCode = async () => {
    if (!teamId || !questionId) return;

    try {
      // Fetch the original buggy code without teamId to get fresh question
      const res = await fetch(
        `${API_URL}/questions/${themeMap[housename] || housename}/${questionNumber}`
      );
      const data = await res.json();

      if (data && data.success && data.question) {
        setCode(data.question.buggedCode || "// No buggy code found");
        setIsSubmittedCode(false);
      }
    } catch (err) {
      console.error("Error resetting to original code:", err);
    }
  };

  // 🔹 Function to fetch code (extracted for reuse)
  const fetchCode = async () => {
    if (!teamId) return; // Wait for teamId to be available

    try {
      const res = await fetch(
        `${API_URL}/questions/${themeMap[housename] || housename}/${questionNumber}?teamId=${teamId}`
      );
      const data = await res.json();
      //for bebugging
      console.log(data)
      if (data && data.success && data.question) {
        setCode(data.question.code || data.question.buggedCode || "// No code found");
        setTestCases(data.question.testCases || []);
        setQuestionId(data.question._id); // ✅ save questionId
        setQuestionDescription(data.question.questionDescription || ""); // ✅ save question description

        // ✅ Check if we're showing submitted code or original buggy code
        setIsSubmittedCode(data.question.code !== data.question.buggedCode);
      } else {
        setCode("// ⚠ No code found for this question.");
        setIsSubmittedCode(false);
        setQuestionDescription("");
      }
    } catch (err) {
      setCode("// ⚠ Error fetching code.");
      console.error(err);
    }
  };

  // 🔹 Fetch buggy code & testcases
  useEffect(() => {
    setTheme(themeMap[housename] || housename);
    fetchCode();
  }, [housename, questionNumber, teamId]); // ✅ Added teamId dependency

  // 🔹 Run code by sending to backend
  const runCode = async () => {
    if (!teamId) {
      setOutput("⚠ Team not logged in!");
      return;
    }
    if (!questionId) {
      setOutput("⚠ No questionId found!");
      return;
    }

    setIsRunning(true); // ✅ Start loading
    setOutput("Running your code..."); // ✅ Show loading message
    setSubmissionResults([]); // ✅ Clear previous results

    try {
      const res = await fetch(`${API_URL}/submission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          teamId,
          language: "c",
          code,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        setTestCasesPassed(data.testcasesPassed || 0);
        setTestCasesTotal(data.testcasesTotal || 0);
        setSubmissionResults(data.submission.results || []);

        // ✅ Refresh the code after submission to get the latest submitted version
        setTimeout(() => {
          fetchCode();
        }, 500); // Small delay to ensure submission is saved

        if (data.submission.passedAll) {
          navigate(`/dialogue/${theme}`); // theme is Gryffindor/Hufflepuff/etc.
        }

        // Only show results for first 2 test cases in output
        const visibleResults = data.submission.results.slice(0, 2);
        const hiddenCount = data.submission.results.length - 2;

        const resultsText = visibleResults
          .map(
            (r, i) =>
              `Test Case ${i + 1}:\nInput: ${r.input}\nExpected: ${r.expectedOutput}\nActual: ${r.actualOutput}\nPassed: ${r.passed ? '✅' : '❌'}\n`
          )
          .join("\n");

        const hiddenText = hiddenCount > 0 ?
          `\n--- ${hiddenCount} Hidden Test Cases ---\nResults for hidden test cases are processed but not shown here.` : '';

        setOutput(resultsText + hiddenText);
      } else {
        setOutput("⚠ Error: submission failed.");
      }
    } catch (err) {
      setOutput("⚠ Error connecting to backend");
      console.error(err);
    } finally {
      setIsRunning(false); // ✅ Stop loading
    }
  };

  return (
    <div className={`wizard-ide ${theme}`}>
      <div className="topbar">
        <h2>
          Wizard IDE  – {theme} | Question {questionNumber}
          {isSubmittedCode && (
            <span className="code-status"> (Your Last Submission)</span>
          )}
        </h2>
        <button
          className="back-btn"
          onClick={() => navigate(`/${theme.toLowerCase()}/map`)}  // ✅ navigate back to map
        >
          ⬅ Back
        </button>
      </div>

      {/* Question Description Section */}
      {questionDescription && (
        <div className="question-description">
          <h3>Problem Description</h3>
          <p>{questionDescription}</p>
        </div>
      )}

      <div className="monaco-editor-container">
        <Editor
          height="400px"
          defaultLanguage="c"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
        />
      </div>

      <div className="content-container">
        <div className="button-row">
          <button
            className="run-btn"
            onClick={runCode}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "▶ Run"}
          </button>

          {isSubmittedCode && (
            <button
              className="reset-btn"
              onClick={resetToOriginalCode}
              disabled={isRunning}
            >
              🔄 Reset to Original
            </button>
          )}
        </div>

        {/* Test Cases Passed Summary */}
        {isRunning ? (
          <div className="loading-results">
            <h3>Processing your submission...</h3>
            <p>Please wait while we test your code against all test cases.</p>
          </div>
        ) : (
          testCasesTotal > 0 && (
            <div className="testcase-summary">
              <h3>Test Cases: {testCasesPassed}/{testCasesTotal} Passed</h3>
            </div>
          )
        )}

        {testCases.length > 0 && !isRunning && (
          <div className="testcase-box">
            <h3>Test Cases</h3>
            {/* Show only first 2 test cases */}
            {testCases.slice(0, 2).map((tc, i) => (
              <div key={i} className="testcase">
                <p><b>Input:</b> {tc.input}</p>
                <p><b>Expected Output:</b> {tc.expectedOutput}</p>
                {submissionResults[i] && (
                  <p><b>Actual Output:</b> {submissionResults[i].actualOutput}</p>
                )}
                {submissionResults[i] && (
                  <p><b>Status:</b> <span className={submissionResults[i].passed ? 'passed' : 'failed'}>
                    {submissionResults[i].passed ? '✅ Passed' : '❌ Failed'}
                  </span></p>
                )}
              </div>
            ))}

            {/* Show hidden test cases count */}
            {testCases.length > 2 && (
              <div className="hidden-testcases">
                <p><b>+ {testCases.length - 2} Hidden Test Cases</b></p>
                <p className="hidden-note">These will be evaluated when you submit your code</p>
              </div>
            )}
          </div>
        )}

        <div className="output">
          <h3>Your Output</h3>
          {isRunning ? (
            <div className="loading-output">
              <p>Executing your code...</p>
              <p>This may take a few seconds.</p>
            </div>
          ) : (
            <pre>{output}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
