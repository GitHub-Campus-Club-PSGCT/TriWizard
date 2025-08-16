import { useState } from "react";
import "../../components-css/login.css"; // import custom styles

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState("email"); // email | otp | success
  const [message, setMessage] = useState("");

  const handleGetOtp = () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    console.log("Mock OTP (for testing):", newOtp);
    setStep("otp");
    setMessage(`OTP sent to ${email} (check console in this demo).`);
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setStep("success");
      setMessage("✅ Login successful!");
    } else {
      setMessage("❌ Invalid OTP. Try again.");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Login</h1>

        {step === "email" && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleGetOtp} className="btn">
              Get OTP
            </button>
          </div>
        )}

        {step === "otp" && (
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              className="input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp} className="btn">
              Verify OTP
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="success">🎉 Welcome, {email}!</div>
        )}

        {message && <p className="msg">{message}</p>}
      </div>
    </div>
  );
}
