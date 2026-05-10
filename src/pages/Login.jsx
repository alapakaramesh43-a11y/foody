import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useApp();

  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) { setError("Enter a valid phone number."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setLoading(false);
      setStep("otp");
      // In real app this would be sent via SMS
      alert(`📱 Your OTP is: ${code}`);
    }, 1000);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 4) { setError("Enter the 4-digit OTP."); return; }
    setLoading(true);
    setTimeout(() => {
      if (otp === generatedOtp) {
        login(phone);
        navigate("/menu");
      } else {
        setError("Wrong OTP. Please try again.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-page page" id="login-page">
      <div className="login-card">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "var(--space-sm)" }}>🍔</div>
          <h2 className="login-title">Welcome to Foody</h2>
          <p className="login-subtitle">
            {step === "phone"
              ? "Enter your phone number to continue"
              : `Enter the 4-digit OTP sent to +91 ${phone}`}
          </p>
        </div>

        {step === "phone" ? (
          <form className="login-form" onSubmit={handleSendOtp} id="phone-form">
            {/* Social buttons */}
            <button type="button" className="btn btn-secondary" id="google-login-btn"
              style={{ justifyContent: "flex-start", gap: "var(--space-md)" }}>
              <span>🔵</span> Continue with Google
            </button>
            <button type="button" className="btn btn-secondary" id="apple-login-btn"
              style={{ justifyContent: "flex-start", gap: "var(--space-md)" }}>
              <span>⚫</span> Continue with Apple
            </button>

            <div className="divider">or use phone</div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone-input">Phone Number</label>
              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <input
                  className="input"
                  style={{ maxWidth: 80 }}
                  value="+91"
                  readOnly
                />
                <input
                  id="phone-input"
                  className="input"
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {error && <p style={{ color: "var(--color-error)", fontSize: "var(--text-sm)" }}>{error}</p>}

            <button
              id="send-otp-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", marginTop: "var(--space-sm)" }}
            >
              {loading ? "Sending..." : "Send OTP →"}
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleVerifyOtp} id="otp-form">
            <div className="form-group">
              <label className="form-label" htmlFor="otp-input">One-Time Password</label>
              <input
                id="otp-input"
                className="input"
                type="tel"
                placeholder="• • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={4}
                required
                style={{ fontSize: "var(--text-2xl)", letterSpacing: "0.5em", textAlign: "center" }}
                autoFocus
              />
            </div>

            {error && <p style={{ color: "var(--color-error)", fontSize: "var(--text-sm)" }}>{error}</p>}

            <button
              id="verify-otp-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Verifying..." : "Verify & Continue 🚀"}
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
              style={{ width: "100%" }}
              id="back-btn"
            >
              ← Change number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;