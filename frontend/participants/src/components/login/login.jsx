import React, { useState, useEffect, useRef } from "react";
import "../../components-css/login.css";
import axios from "axios";
import mapBackground from "../../assets/Images/LoginBG.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",
  withCredentials: true,
});

const STEPS = {
  EMAIL: "email",
  OTP: "otp",
  SUCCESS: "success",
};

const Snitch = React.memo(() => (
  <svg className="snitch" viewBox="0 0 200 100" aria-hidden>
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
  const { login, isLoggedIn, user } = useAuth(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [step, setStep] = useState(STEPS.EMAIL);
  const [loading, setLoading] = useState(false);
  const [assignedHouse, setAssignedHouse] = useState(null);
  const otpInputRefs = useRef([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // ⭐ If already logged in, skip login flow
   useEffect(() => {
    if (isLoggedIn && user) {
      setAssignedHouse(user.houseName);
      setStep(STEPS.SUCCESS);
      const timer = setTimeout(() => {
        navigate(`/${user.houseName.toLowerCase()}/map`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, user, navigate]);

  const handleGetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.setItem("email", email);
      await api.post("/login/otp-gen", { email });
      setStep(STEPS.OTP);
    } catch (error) {
      alert(error?.response?.data?.message || "Could not generate OTP, try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) return;

    const savedEmail = localStorage.getItem("email");
    if (!savedEmail) {
      alert("Email not found. Please go back and enter your email again.");
      setStep(STEPS.EMAIL);
      return;
    }

    const rollNumber = savedEmail.split("@")[0].toLowerCase();
console.log("Attempting to verify with Roll Number:", rollNumber);
    try {
      const res = await login(rollNumber, enteredOtp);
      console.log("Login response:", res.success);
      //console.log("User data:", res.user.houseName);


      if (res?.success) {
        setAssignedHouse(res.houseName);
        setStep(STEPS.SUCCESS);
      } else {
        // This case should ideally not be hit if login throws an error
        alert("OTP verified but no user data returned.");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "OTP verification failed");
    }
  };

  const handleOtpChange = (element, index) => {
    const val = element.value.replace(/\D/g, "");
    if (!val && otp[index] && index > 0 && !element.value) {
      otpInputRefs.current[index - 1]?.focus();
    }
    const next = [...otp];
    next[index] = val.slice(-1);
    setOtp(next);
    if (val && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < otp.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
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
              <input
                type="email"
                placeholder="Your magical signature (email)"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Casting..." : "Cast Spell"}
              </button>
            </form>
          </div>
        )}

        {step === STEPS.OTP && (
          <div className="step-container" key="otp">
            <h1 className="title">The Final Incantation</h1>
            <p className="subtitle">Whisper the six secret runes.</p>
            <form onSubmit={handleVerifyOtp} className="magical-form">
              <div className="otp-container">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    className="otp-input"
                    value={data}
                    maxLength="1"
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    required
                    aria-label={`OTP Digit ${index + 1}`}
                  />
                ))}
              </div>
              <button type="submit" className="btn">Unlock</button>
            </form>
          </div>
        )}

        {step === STEPS.SUCCESS && (
          <div className="sorting-container" key="success">
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
              onClick={() =>navigate(`/${assignedHouse.toLowerCase()}/map`)}
            >
              Enter the Trial
            </button>
          </div>
        )}
      </div>

      {isModalVisible && <SnitchDetailsModal onClose={() => setIsModalVisible(false)} />}
    </div>
  );
}