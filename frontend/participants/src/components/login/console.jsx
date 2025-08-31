import "../../components-css/WizardIDE.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";


export default function WizardIDE() {
  const { housename, questionNumber } = useParams(); 
   

  const [theme, setTheme] = useState(""); 
  const [code, setCode] = useState("// Loading question...");
  const [output, setOutput] = useState("Result will appear here...");
  const [testCases, setTestCases] = useState([]);
  const [questionId, setQuestionId] = useState(null); // ✅ store questionId
  const [teamId, setTeamId] = useState(null);

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
        const res = await fetch("http://localhost:8080/admin/teamid", {
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
          `http://localhost:8080/questions/${themeMap[housename] || housename}/${questionNumber}`
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
      const res = await fetch("http://localhost:8080/submission", {
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

      if (data.success) {
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
          Wizard IDE 🪄 – {theme} | Question {questionNumber}
        </h2>
      </div>

      <Editor
        height="400px"
        defaultLanguage="c"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
      />

      <button className="run-btn" onClick={runCode}>
        ▶ Run
      </button>

      {testCases.length > 0 && (
        <div className="testcase-box">
          <h3>Test Cases</h3>
          {testCases.map((tc, i) => (
            <div key={i} className="testcase">
              <p><b>Input:</b> {tc.input}</p>
              <p><b>Expected Output:</b> {tc.expectedOutput}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="output">
        <h3>Your Output</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
}
