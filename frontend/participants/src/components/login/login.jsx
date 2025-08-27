import React, { useState, useEffect, useRef } from "react";
import "../../components-css/login.css";
import axios from "axios";
import mapBackground from "../../assets/Images/LoginBG.png";
import { useAuth } from "../../context/AuthContext";

const STEPS = {
  EMAIL: "email",
  OTP: "otp",
  SUCCESS: "success",
  CLEARED: "cleared",
};

const Snitch = React.memo(() => (
  <svg className="snitch" viewBox="0 0 200 100">
    <g className="wings">
      <path className="wing" d="M50,50 Q20,20 0,50 Q20,80 50,50 Z" />
      <path className="wing" d="M150,50 Q180,20 200,50 Q180,80 150,50 Z" />
    </g>
    <circle className="body" cx="100" cy="50" r="15" />
  </svg>
));

const SnitchDetailsModal = ({ onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2 className="modal-title">The Golden Snitch</h2>
      <p className="modal-text">
        A walnut-sized, winged golden sphere. In Quidditch, the Seeker who
        catches it scores one hundred and fifty points, and its capture ends
        the game.
      </p>
      <button className="btn modal-close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

export default function Login() {
  const { login } = useAuth(); // ✅ use context login

  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [step, setStep] = useState(STEPS.EMAIL);
  const [loading, setLoading] = useState(false);
  const [assignedHouse, setAssignedHouse] = useState(null);
  const otpInputRefs = useRef([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (step === STEPS.SUCCESS) {
      const timer = setTimeout(() => setStep(STEPS.CLEARED), 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleGetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/login/otp-gen", { email });
      setStep(STEPS.OTP);
    } catch (error) {
      alert("Could not generate OTP, try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) return;

    const user = await login(teamName, enteredOtp);
    if (user) {
      setAssignedHouse(user.houseName);
      setTeamName(user.teamName);
      setStep(STEPS.CLEARED);
    } else {
      alert("Wrong spell! Please try again.");
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="page magical-container" style={{ backgroundImage: `url(${mapBackground})` }}>
      {/* Snitches */}
      <div className="snitch-container snitch-1" onClick={() => setIsModalVisible(true)}><Snitch /></div>
      <div className="snitch-container snitch-2" onClick={() => setIsModalVisible(true)}><Snitch /></div>
      <div className="snitch-container snitch-3" onClick={() => setIsModalVisible(true)}><Snitch /></div>

      <div className="floating-ui">
        {step === STEPS.EMAIL && (
          <div className="step-container" key="email">
            <h1 className="title">REVEAL YOUR<br />IDENTITY</h1>
            <p className="subtitle">Only the worthy may enter the castle grounds.</p>
            <form onSubmit={handleGetOtp} className="magical-form">
              <input type="email" placeholder="Your magical signature (email)" className="input"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Casting..." : "Cast Spell"}
              </button>
            </form>
          </div>
        )}

        {step === STEPS.OTP && (
          <div className="step-container" key="otp">
            <h1 className="title">The Final Incantation</h1>
            <p className="subtitle">Speak your team’s name and whisper the six secret runes.</p>
            <form onSubmit={handleVerifyOtp} className="magical-form">
              <input type="text" placeholder="Your Team Name" className="input"
                value={teamName} onChange={(e) => setTeamName(e.target.value)} required />

              <div className="otp-container">
                {otp.map((data, index) => (
                  <input key={index} type="text" className="otp-input" value={data} maxLength="1"
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    ref={(el) => (otpInputRefs.current[index] = el)} required />
                ))}
              </div>
              <button type="submit" className="btn">Unlock</button>
            </form>
          </div>
        )}

        {step === STEPS.CLEARED && (
          <div className="sorting-container" key="cleared">
            <h1 className="title sorted-title">The Sorting Ceremony is Complete!</h1>
            <div className="house-banners">
              <div className={`banner gryffindor ${assignedHouse === "Gryffindor" ? "chosen" : ""}`}></div>
              <div className={`banner hufflepuff ${assignedHouse === "Hufflepuff" ? "chosen" : ""}`}></div>
              <div className={`banner ravenclaw ${assignedHouse === "Ravenclaw" ? "chosen" : ""}`}></div>
              <div className={`banner slytherin ${assignedHouse === "Slytherin" ? "chosen" : ""}`}></div>
            </div>
            <p className="subtitle success-subtitle">
              You belong to... <strong>{assignedHouse}!</strong>
            </p>
            <button className="btn success-btn" onClick={() => alert("Navigating to the Great Hall dashboard!")}>
              Enter the Great Hall
            </button>
          </div>
        )}
      </div>

      {isModalVisible && <SnitchDetailsModal onClose={() => setIsModalVisible(false)} />}
    </div>
  );
}
