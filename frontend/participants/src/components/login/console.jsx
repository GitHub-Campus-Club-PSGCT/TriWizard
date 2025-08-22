import "../../components-css/WizardIDE.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function WizardIDE() {
  const { ques_id } = useParams(); // 👈 get ques_id from route
  const [theme, setTheme] = useState("gryffindor"); 
  const [code, setCode] = useState("// Loading question...");
  const [output, setOutput] = useState("Result will appear here...");

  // 🔹 Fetch buggy code for this question when page loads
  useEffect(() => {
    const fetchBuggyCode = async () => {
      try {
        const res = await fetch(`http://localhost:5000/buggy-codes/${ques_id}`);
        const data = await res.json();
        if (data && data.code) {
          setCode(data.code);
        } else {
          setCode("// No buggy code found for this question.");
        }
      } catch (err) {
        setCode("// ⚠ Error fetching buggy code.");
      }
    };

    fetchBuggyCode();
  }, [ques_id]);

  // 🔹 Run code by sending to backend
  const runCode = async () => {
    try {
      const res = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, ques_id }), // 👈 also send ques_id
      });
      const data = await res.json();
      setOutput(data.output || "No output");
    } catch (err) {
      setOutput("⚠ Error connecting to backend");
    }
  };

  return (
    <div className={`wizard-ide ${theme}`}>
      {/* Top Bar with Theme Selector */}
      <div className="topbar">
        <h2>Wizard IDE 🪄 – Question {ques_id}</h2>
        <div className="themes">
          {["gryffindor", "hufflepuff", "ravenclaw", "slytherin"].map((h) => (
            <button
              key={h}
              onClick={() => setTheme(h)}
              className={theme === h ? "active" : ""}
            >
              {h}
            </button>
          ))}
        </div>
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

      {/* Output Section */}
      <div className="output">
        <pre>{output}</pre>
      </div>
    </div>
  );
}
