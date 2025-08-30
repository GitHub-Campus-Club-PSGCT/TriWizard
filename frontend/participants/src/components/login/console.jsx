import "../../components-css/WizardIDE.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//import Editor from "@monaco-editor/react";

export default function WizardIDE() {
  const { housename, questionNumber } = useParams(); // housename can be "1", "2", etc.
  const [theme, setTheme] = useState(""); 
  const [code, setCode] = useState("// Loading question...");
  const [output, setOutput] = useState("Result will appear here...");
  const [testCases, setTestCases] = useState([]);

  // 🔹 Number-to-theme mapping
  const themeMap = {
    "1": "Gryffindor",
    "2": "Hufflepuff",
    "3": "Ravenclaw",
    "4": "Slytherin",
  };

  // 🔹 Fetch buggy code & testcases
  useEffect(() => {
    setTheme(themeMap[housename] || housename); // Map number to theme

    const fetchBuggyCode = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/questions/${themeMap[housename] || housename}/${questionNumber}`
        );
        const data = await res.json();

        if (data && data.success && data.question) {
          setCode(data.question.buggedCode || "// No buggy code found");
          setTestCases(data.question.testCases || []);
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
    try {
      const res = await fetch("http://localhost:8080/run-code", {
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
      <div className="topbar">
        <h2>
          Wizard IDE 🪄 – {theme} | Question {questionNumber}
        </h2>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="400px"
        defaultLanguage="c"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
      />

      {/* Run Button */}
      <button className="run-btn" onClick={runCode}>
        ▶ Run
      </button>

      {/* Test Cases */}
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

      {/* Output */}
      <div className="output">
        <h3>Your Output</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
}
