import "../../components-css/WizardIDE.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function WizardIDE() {
  const { housename, questionNumber } = useParams(); // 👈 from /:housename/:questionNumber
  const [theme, setTheme] = useState(housename); // auto theme = housename
  const [code, setCode] = useState("// Loading question...");
  const [output, setOutput] = useState("Result will appear here...");
  const [testCases, setTestCases] = useState([]);

  const themeMap = {
    "1": "Gryffindor",
    "2": "Hufflepuff",
    "3": "Ravenclaw",
    "4": "Slytherin",
  };

  // 🔹 Fetch buggy code & testcases
  useEffect(() => {
    if (themeMap[housename]) {
      setTheme(themeMap[housename]);
    }
    else {
    // Otherwise directly use housename (like "Hufflepuff")
    setTheme(housename);
  }
    const fetchBuggyCode = async () => {
      try {
        const res = await fetch(`http://localhost:8080/questions/${housename}/${questionNumber}`);
        const data = await res.json();

        if (data && data.success && data.question) {
          setCode(data.question.buggedCode);
          setTestCases(data.question.testCases || []);
        } else {
          setCode("// No buggy code found for this question.");
        }

      } catch (err) {
        setCode("// ⚠ Error fetching buggy code.");
      }
    };

    fetchBuggyCode();
  }, [housename, questionNumber]);

  // 🔹 Run code by sending to backend
  const runCode = async () => {
    try {
      const res = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, housename, questionNumber }),
      });
      const data = await res.json();
      setOutput(data.output || "No output");
    } catch (err) {
      setOutput("⚠ Error connecting to backend");
    }
  };

  return (
    <div className={`wizard-ide ${theme}`}>
      {/* Top Bar with Theme */}
      <div className="topbar">
        <h2>
          Wizard IDE 🪄 – {housename} | Question {questionNumber}
        </h2>
        <p className="theme-label">Theme: {theme}</p>
      </div>

      {/* Code Editor */}
      <textarea
        className="editor"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {/* Run Button */}
      <button className="run-btn" onClick={runCode}>
        ▶ Run
      </button>

      {/* ✅ Testcases Display */}
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

      {/* Output Section */}
      <div className="output">
        <h3>Your Output</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
}
