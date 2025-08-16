import { useState, useEffect, useRef } from "react";
import "../../components-css/login.css"; // Your original CSS path
import mapBackground from "../../assets/marauders-map.jpg"; // Import the image from src/assets/

const STEPS = {
  EMAIL: "email",
  OTP: "otp",
  SUCCESS: "success",
  CLEARED: "cleared",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState(STEPS.EMAIL);
  const [loading, setLoading] = useState(false);
  const [assignedHouse, setAssignedHouse] = useState(null);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    if (step === STEPS.SUCCESS) {
      const timer = setTimeout(() => {
        setStep(STEPS.CLEARED);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleGetOtp = (e) => { e.preventDefault(); setLoading(true); setTimeout(() => { const newOtp = Math.floor(100000 + Math.random() * 900000).toString(); setGeneratedOtp(newOtp); console.log("🤫 Secret Code (for testing):", newOtp); setStep(STEPS.OTP); setLoading(false); }, 1500); };
  const handleVerifyOtp = (e) => { e.preventDefault(); const enteredOtp = otp.join(""); if (enteredOtp.length < 6) return; if (enteredOtp === generatedOtp) { const houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin']; setAssignedHouse(houses[Math.floor(Math.random() * houses.length)]); setStep(STEPS.SUCCESS); } else { alert("Wrong spell! Please try again."); } };
  const handleOtpChange = (element, index) => { if (isNaN(element.value)) return false; setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]); if (element.nextSibling && element.value) { element.nextSibling.focus(); } };
  const handleOtpKeyDown = (e, index) => { if (e.key === "Backspace" && !otp[index] && index > 0 && otpInputRefs.current[index - 1]) { otpInputRefs.current[index - 1].focus(); } };

  const Snitch = () => (
    <svg className="snitch" viewBox="0 0 200 100">
      <g className="wings">
        <path className="wing" d="M50,50 Q20,20 0,50 Q20,80 50,50 Z" />
        <path className="wing" d="M150,50 Q180,20 200,50 Q180,80 150,50 Z" />
      </g>
      {/* --- VISIBILITY FIX: Added a stroke for contrast --- */}
      <circle className="body" cx="100" cy="50" r="15" stroke="#3a2e20" strokeWidth="2" />
    </svg>
  );

  return (
    <div 
      className="page marauders-map" 
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      <div className="snitch-container snitch-1"><Snitch /></div>
      <div className="snitch-container snitch-2"><Snitch /></div>
      <div className="snitch-container snitch-3"><Snitch /></div>
      
      <div className="floating-ui">
        {step === STEPS.EMAIL && (
          <div className="step-container" key="email">
            <h1 className="title">I solemnly swear that I am up to no good.</h1>
            <p className="subtitle">State your name to reveal the secrets of the castle.</p>
            <form onSubmit={handleGetOtp} className="magical-form">
              <input type="email" placeholder="Your Owl Post Address" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Revealing..." : "Reveal Passages"}
              </button>
            </form>
          </div>
        )}

        {step === STEPS.OTP && (
          <div className="step-container" key="otp">
            <h1 className="title">Whisper the Incantation</h1>
            <p className="subtitle">Enter the six secret runes to unlock the way.</p>
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
              <button type="submit" className="btn">Enter</button>
            </form>
          </div>
        )}
        
        {step === STEPS.SUCCESS && (
           <div className="mischief-container">
              <h1 className="mischief-text">Mischief Managed!</h1>
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
            <p className="subtitle success-subtitle">You belong to... <strong>{assignedHouse}!</strong></p>
            <button 
              className="btn success-btn" 
              onClick={() => alert('Navigating to the Great Hall dashboard!')}
            >
              Enter the Great Hall
            </button>
          </div>
        )}
      </div>
    </div>
  );
}