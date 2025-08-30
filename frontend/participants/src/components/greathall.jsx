import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../components-css/Rules.css";
import dumbledore from "../assets/dumbledore.png"; 
import bg from "../assets/greathall.jpg"; 

const Rules = () => {
  const dialogueParts = [
    "Champions, tonight you step into a battle not against dark wizards... but against something far more treacherous: corrupted code.",
    "Seven fragments lie before you — Seven Horcruxes of Code. Each one is broken, cursed, and crawling with errors.",
    "Your task is not simple patchwork. No — you must tear the bugs out by their roots, rebuild the logic, and restore the spell of functionality.",
    "But beware... these Horcruxes are deceptive. Some will trick you with simple slips, others will hide their flaws deep within the shadows of logic.",
    "Remember this: not all will advance. From each house, only two teams — the most relentless debuggers — shall earn the right to move forward.",
    "Now, hear the words of your house guardians. Listen well, for they will prepare you for the storm ahead..."
  ];

  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNextDialogue = () => {
    if (step < dialogueParts.length) {
      setStep(step + 1);
    }
  };

  const handleNavigate = () => {
    navigate("/your-route-here"); // 👉 replace with your route
  };

  return (
    <div className="rules-container" style={{ backgroundImage: `url(${bg})` }}>
      <div className="dumbledore">
        <img src={dumbledore} alt="Dumbledore" className="dumbledore-sticker" />
      </div>

      <div className="dialogue-box" onClick={handleNextDialogue}>
        <h2>Dumbledore’s Rules</h2>

        {dialogueParts.slice(0, step).map((part, idx) => (
          <p key={idx}>{part}</p>
        ))}

        {step < dialogueParts.length && (
          <p className="click-hint">Click to reveal more...</p>
        )}

        {step === dialogueParts.length && (
          <button className="next-btn" onClick={handleNavigate}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default Rules;
