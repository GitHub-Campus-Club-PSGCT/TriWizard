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
  const navigate = useNavigate();
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

  // 🔹 Fetch buggy code & testcases
  useEffect(() => {
    setTheme(themeMap[housename] || housename);

    const fetchBuggyCode = async () => {
      try {
        const res = await fetch(
          `${API_URL}/questions/${themeMap[housename] || housename}/${questionNumber}`
        );
        const data = await res.json();

        if (data && data.success && data.question) {
          setCode(data.question.buggedCode || "// No buggy code found");
          setTestCases(data.question.testCases || []);
          setQuestionId(data.question._id); // ✅ save questionId
        } else {
          setCode("// ⚠ No buggy code found for this question.");
        }
      } catch (err) {
        setCode("// ⚠ Error fetching buggy code.");
        console.error(err);
      }
    };

    fetchBuggyCode();
  }, [housename, questionNumber]);

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
        
      if (data.submission.passedAll) {
        navigate(`/dialogue/${theme}`); // theme is Gryffindor/Hufflepuff/etc.
      }

        const resultsText = data.submission.results
          .map(
            (r, i) =>
              `Test Case ${i + 1}:\nInput: ${r.input}\nExpected: ${r.expectedOutput}\nActual: ${r.actualOutput}\nPassed: ${r.passed}\n`
          )
          .join("\n");
        setOutput(resultsText);
      } else {
        setOutput("⚠ Error: submission failed.");
      }
    } catch (err) {
      setOutput("⚠ Error connecting to backend");
      console.error(err);
    }
  };

  return (
    <div className={`wizard-ide ${theme}`}>
      <div className="topbar">
        <h2>
          Wizard IDE  – {theme} | Question {questionNumber}
        </h2>
        <button 
          className="back-btn" 
          onClick={() => navigate(`/${theme.toLowerCase()}/map`)}  // ✅ navigate back to map
        >
          ⬅ Back
          </button>
      </div>

      <div className="monaco-editor-container">
        <Editor
          height="400px"
          defaultLanguage="c"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
        />
      </div>

      <div className="content-container">
        <button className="run-btn" onClick={runCode}>
          ▶ Run
        </button>

        {/* Test Cases Passed Summary */}
        {testCasesTotal > 0 && (
          <div className="testcase-summary">
            <h3>Test Cases: {testCasesPassed}/{testCasesTotal} Passed</h3>
          </div>
        )}

        {testCases.length > 0 && (
          <div className="testcase-box">
            <h3>Test Cases</h3>
            {testCases.map((tc, i) => (
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
          </div>
        )}
        
        <div className="output">
          <h3>Your Output</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}
