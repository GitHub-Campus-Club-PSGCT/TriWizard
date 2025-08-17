import { useState, useEffect, useRef } from "react";
import "../../components-css/login.css";

const STEPS = {
  EMAIL: "email",
  OTP: "otp",
  CLEARED: "cleared", // 'SUCCESS' step is removed
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState(STEPS.EMAIL);
  const [loading, setLoading] = useState(false);
  const [assignedHouse, setAssignedHouse] = useState(null);
  const [showSnitchDetails, setShowSnitchDetails] = useState(false);
  const otpInputRefs = useRef([]);

  const handleGetOtp = (e) => { e.preventDefault(); setLoading(true); setTimeout(() => { const newOtp = Math.floor(100000 + Math.random() * 900000).toString(); setGeneratedOtp(newOtp); console.log("🤫 Secret Code (for testing):", newOtp); setStep(STEPS.OTP); setLoading(false); }, 1500); };
  
  const handleVerifyOtp = (e) => { 
    e.preventDefault(); 
    const enteredOtp = otp.join(""); 
    if (enteredOtp.length < 6) return; 
    
    if (enteredOtp === generatedOtp) { 
      const houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin']; 
      setAssignedHouse(houses[Math.floor(Math.random() * houses.length)]); 
      setStep(STEPS.CLEARED); // Directly transition to the final cleared state
    } else { 
      alert("Wrong spell! Please try again."); 
    } 
  };
  
  const handleOtpChange = (element, index) => { if (isNaN(element.value)) return false; setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]); if (element.nextSibling && element.value) { element.nextSibling.focus(); } };
  const handleOtpKeyDown = (e, index) => { if (e.key === "Backspace" && !otp[index] && index > 0 && otpInputRefs.current[index - 1]) { otpInputRefs.current[index - 1].focus(); } };

  const Snitch = () => ( <svg className="snitch" viewBox="0 0 200 100"> <g className="wings"> <path className="wing" d="M50,50 Q20,20 0,50 Q20,80 50,50 Z" /> <path className="wing" d="M150,50 Q180,20 200,50 Q180,80 150,50 Z" /> </g> <circle className="body" cx="100" cy="50" r="15" /> </svg> );

  return (
    <div className="page magical-container">
      <div className="stars"></div>
      <div className="twinkling"></div>
      
      <div className="snitch-container snitch-1" onClick={() => setShowSnitchDetails(true)}><Snitch /></div>
      <div className="snitch-container snitch-2" onClick={() => setShowSnitchDetails(true)}><Snitch /></div>
      <div className="snitch-container snitch-3" onClick={() => setShowSnitchDetails(true)}><Snitch /></div>

      <div className="content-wrapper">
        {step === STEPS.EMAIL && (
          <div className="step-container" key="email">
            <h1 className="title">Reveal Your Identity</h1>
            <p className="subtitle">Only the worthy may enter the castle grounds.</p>
            <form onSubmit={handleGetOtp} className="magical-form">
              <input type="email" placeholder="Your magical signature (email)" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Casting..." : "Cast Spell"}
              </button>
            </form>
          </div>
        )}

        {step === STEPS.OTP && (
          <div className="step-container" key="otp">
            <h1 className="title">The Final Incantation</h1>
            <p className="subtitle">Whisper the six secret runes to unlock the way.</p>
            <form onSubmit={handleVerifyOtp} className="magical-form">
              <div className="otp-container">
                {otp.map((data, index) => (
                  <input key={index} type="text" className="otp-input" value={data} maxLength="1"
                    onChange={e => handleOtpChange(e.target, index)}
                    onKeyDown={e => handleOtpKeyDown(e, index)}
                    ref={el => (otpInputRefs.current[index] = el)}
                    required
                  />
                ))}
              </div>
              <button type="submit" className="btn">Unlock</button>
            </form>
          </div>
        )}
        
        {step === STEPS.CLEARED && (
          <div className="success-container" key="success">
            <h1 className="title sorted-title">The Sorting Ceremony is Complete!</h1>
            <div className="house-banners">
              <div className={`banner gryffindor ${assignedHouse === 'Gryffindor' ? 'chosen' : ''}`}></div>
              <div className={`banner hufflepuff ${assignedHouse === 'Hufflepuff' ? 'chosen' : ''}`}></div>
              <div className={`banner ravenclaw ${assignedHouse === 'Ravenclaw' ? 'chosen' : ''}`}></div>
              <div className={`banner slytherin ${assignedHouse === 'Slytherin' ? 'chosen' : ''}`}></div>
            </div>
            <p className="subtitle success-subtitle">Welcome to</p>
            <p className="house-name">{assignedHouse}!</p>
            <button 
              className="btn success-btn" 
              onClick={() => alert('Navigating to the Great Hall dashboard!')}
            >
              Enter the Great Hall
            </button>
          </div>
        )}
      </div>

      {showSnitchDetails && (
        <div className="modal-overlay" onClick={() => setShowSnitchDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">The Golden Snitch</h2>
            <p className="modal-text">
              Originally a living magical bird known as the Golden Snidget, this enchanted ball is the most important in the game of Quidditch. It is walnut-sized, has silver wings, and flies at high speeds.
            </p>
            <p className="modal-text">
              Catching it earns the Seeker's team <strong>150 points</strong> and ends the match!
            </p>
            <button className="btn" onClick={() => setShowSnitchDetails(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}