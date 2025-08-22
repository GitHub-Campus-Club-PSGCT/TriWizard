import React, { useState, useEffect, useRef } from "react";
import "../../components-css/login.css"; // Your original CSS path
import mapBackground from "../../assets/Images/LoginBG.png"; // Your background image path

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

const EmailStep = ({ onSubmit, email, setEmail, loading }) => (
  <div className="step-container" key="email">
    <h1 className="title">REVEAL YOUR<br />IDENTITY</h1>
    <p className="subtitle">Only the worthy may enter the castle grounds.</p>
    <form onSubmit={onSubmit} className="magical-form">
      <label htmlFor="email-input" className="sr-only">Your magical signature (email)</label>
      <input
        id="email-input"
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
);

const OtpStep = ({ onSubmit, otp, onOtpChange, onOtpKeyDown, otpInputRefs, error }) => (
  <div className="step-container" key="otp">
    <h1 className="title">The Final Incantation</h1>
    <p className="subtitle">Whisper the six secret runes to unlock the way.</p>
    <form onSubmit={onSubmit} className="magical-form">
      <div className="otp-container">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            aria-label={`OTP digit ${index + 1}`}
            className="otp-input"
            value={data}
            maxLength="1"
            onChange={e => onOtpChange(e.target, index)}
            onKeyDown={e => onOtpKeyDown(e, index)}
            ref={el => (otpInputRefs.current[index] = el)}
            required
          />
        ))}
      </div>
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="btn">Unlock</button>
    </form>
  </div>
);

const SuccessStep = () => (
  <div className="mischief-container" key="success">
    <h1 className="title success-title">Incantation Complete</h1>
  </div>
);

const ClearedStep = ({ assignedHouse }) => (
  <div className="sorting-container" key="cleared">
    <h1 className="title sorted-title">The Sorting Ceremony is Complete!</h1>
    <div className="house-banners">
      {HOUSES.map(house => (
        <div key={house} className={`banner ${house.toLowerCase()} ${assignedHouse === house ? 'chosen' : ''}`}></div>
      ))}
    </div>
    <p className="subtitle success-subtitle">You belong to... <strong>{assignedHouse}!</strong></p>
    <button className="btn success-btn" onClick={() => alert('Navigating to the Great Hall dashboard!')}>
      Enter the Great Hall
    </button>
  </div>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState(STEPS.EMAIL);
  const [loading, setLoading] = useState(false);
  const [assignedHouse, setAssignedHouse] = useState(null);
  const otpInputRefs = useRef([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otpError, setOtpError] = useState("");

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

  const handleGetOtp = (e) => {
    e.preventDefault();
    setOtpError(""); // Clear previous errors
    setLoading(true);
    setTimeout(() => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      console.log("🤫 Secret Code (for testing):", newOtp);
      setStep(STEPS.OTP);
      setLoading(false);
    }, 1200);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < OTP_LENGTH) return;
    if (enteredOtp === generatedOtp) {
      setAssignedHouse(HOUSES[Math.floor(Math.random() * HOUSES.length)]);
      setStep(STEPS.SUCCESS);
      setOtpError("");
    } else {
      setOtpError("Wrong spell! Please try again.");
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const renderStep = () => {
    switch (step) {
      case STEPS.EMAIL:
        return <EmailStep onSubmit={handleGetOtp} email={email} setEmail={setEmail} loading={loading} />;
      case STEPS.OTP:
        return <OtpStep
          onSubmit={handleVerifyOtp}
          otp={otp}
          onOtpChange={handleOtpChange}
          onOtpKeyDown={handleOtpKeyDown}
          otpInputRefs={otpInputRefs}
          error={otpError}
        />;
      case STEPS.SUCCESS:
        return <SuccessStep />;
      case STEPS.CLEARED:
        return <ClearedStep assignedHouse={assignedHouse} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="page magical-container"
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
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
        {renderStep()}
      </div>

      {isModalVisible && <SnitchDetailsModal onClose={handleCloseModal} />}
    </div>
  );
}