import React, { useState, useEffect, useRef } from "react";
import "../../components-css/login.css";
import axios from "axios";
import mapBackground from "../../assets/Images/LoginBG.png";

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

const SnitchDetailsModal = ({ onClose }) => {
  return (
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
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");   // ✅ NEW state for team name
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [step, setStep] = useState(STEPS.EMAIL);
  const [loading, setLoading] = useState(false);
  const [assignedHouse, setAssignedHouse] = useState(null);
  const otpInputRefs = useRef([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (step === STEPS.SUCCESS) {
      const timer = setTimeout(() => {
        setStep(STEPS.CLEARED);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSnitchClick = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  // ✅ Step 1: Send email to backend
  const handleGetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/login/otp-gen", {
        email: email,   // backend uses email to find the team
      });

      console.log("✅ OTP Response:", response.data);
      setStep(STEPS.OTP);
    } catch (error) {
      console.error("❌ Error generating OTP:", error.response?.data || error.message);
      alert("Could not generate OTP, try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Verify with teamName + OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) return;

    try {
      const response = await axios.post("http://localhost:8080/login/otp-verify", {
        teamName: teamName,   // ✅ send teamName
        otp: enteredOtp,
      });

      console.log("✅ Verify Response:", response.data);

      if (response.data.success) {
        setAssignedHouse(response.data.houseName);   // ✅ use backend value
        setTeamName(response.data.teamName);         // (optional, keep consistency)
        setStep(STEPS.CLEARED);
      } else {
        alert(response.data.message || "Wrong spell! Please try again.");
      }
    } catch (error) {
      console.error("❌ Error verifying OTP:", error.response?.data || error.message);
      alert("OTP verification failed.");
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
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      otpInputRefs.current[index - 1]
    ) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  return (
    <div
      className="page magical-container"
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      {/* Floating snitches */}
      <div className="snitch-container snitch-1" onClick={handleSnitchClick}>
        <Snitch />
      </div>
      <div className="snitch-container snitch-2" onClick={handleSnitchClick}>
        <Snitch />
      </div>
      <div className="snitch-container snitch-3" onClick={handleSnitchClick}>
        <Snitch />
      </div>

      <div className="floating-ui">
        {/* Step 1 → Email */}
        {step === STEPS.EMAIL && (
          <div className="step-container" key="email">
            <h1 className="title">REVEAL YOUR<br />IDENTITY</h1>
            <p className="subtitle">Only the worthy may enter the castle grounds.</p>
            <form onSubmit={handleGetOtp} className="magical-form">
              <input
                type="email"
                placeholder="Your magical signature (email)"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Casting..." : "Cast Spell"}
              </button>
            </form>
          </div>
        )}

        {/* Step 2 → TeamName + OTP */}
        {step === STEPS.OTP && (
          <div className="step-container" key="otp">
            <h1 className="title">The Final Incantation</h1>
            <p className="subtitle">Speak your team’s name and whisper the six secret runes.</p>
            <form onSubmit={handleVerifyOtp} className="magical-form">
              {/* ✅ Team name input */}
              <input
                type="text"
                placeholder="Your Team Name"
                className="input"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />

              {/* OTP Inputs */}
              <div className="otp-container">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    className="otp-input"
                    value={data}
                    maxLength="1"
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    required
                  />
                ))}
              </div>
              <button type="submit" className="btn">Unlock</button>
            </form>
          </div>
        )}

        {/* Step 3 → Success */}
        {step === STEPS.SUCCESS && (
          <div className="mischief-container" key="success">
            <h1 className="title success-title">Incantation Complete</h1>
          </div>
        )}

        {/* Step 4 → Sorting Ceremony */}
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
            <button
              className="btn success-btn"
              onClick={() => alert("Navigating to the Great Hall dashboard!")}
            >
              Enter the Great Hall
            </button>
          </div>
        )}
      </div>

      {isModalVisible && <SnitchDetailsModal onClose={handleCloseModal} />}
    </div>
  );
}
