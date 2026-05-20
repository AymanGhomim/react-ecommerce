import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const BASE = "https://ecommerce.routemisr.com/api/v1/auth";

export default function ForgotPassword() {
  const [step, setStep]       = useState(1); // 1=email, 2=code, 3=newpass
  const [email, setEmail]     = useState("");
  const [code, setCode]       = useState("");
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) { toast.error("Enter a valid email"); return; }
    setLoading(true);
    try {
      await axios.post(`${BASE}/forgotPasswords`, { email });
      toast.success("Reset code sent to your email! 📧");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Email not found");
    } finally { setLoading(false); }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code.trim()) { toast.error("Enter the reset code"); return; }
    setLoading(true);
    try {
      await axios.post(`${BASE}/verifyResetCode`, { resetCode: code });
      toast.success("Code verified! ✅");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired code");
    } finally { setLoading(false); }
  };

  const handleResetPass = async (e) => {
    e.preventDefault();
    if (!/^[A-Z][a-z0-9]{5,}$/.test(newPass)) {
      toast.error("Password must start with uppercase, min 6 chars");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${BASE}/resetPassword`, { email, newPassword: newPass });
      toast.success("Password reset! Please sign in. 🎉");
      window.location.href = "/auth";
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally { setLoading(false); }
  };

  const steps = [
    { n: 1, label: "Email"    },
    { n: 2, label: "Verify"   },
    { n: 3, label: "New Pass" },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card fp-card">
        <div className="auth-logo">Store</div>
        <h2 className="fp-title">Reset Password</h2>

        {/* Step indicators */}
        <div className="fp-steps">
          {steps.map((s, i) => (
            <div key={s.n} className="fp-step-row">
              <div className={`fp-step-dot ${step >= s.n ? "done" : ""} ${step === s.n ? "current" : ""}`}>
                {step > s.n ? "✓" : s.n}
              </div>
              <span className={`fp-step-label ${step === s.n ? "fp-step-active" : ""}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`fp-step-line ${step > s.n ? "done" : ""}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <form className="auth-fields" onSubmit={handleSendEmail}>
            <p className="fp-hint">Enter your registered email and we'll send you a reset code.</p>
            <div className="form-group">
              <label htmlFor="fp-email">Email Address</label>
              <input
                id="fp-email" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                autoFocus autoComplete="email"
              />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Send Reset Code →"}
            </button>
            <p className="auth-switch">
              Remember it? <Link to="/auth" className="auth-switch-btn">Sign In</Link>
            </p>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form className="auth-fields" onSubmit={handleVerifyCode}>
            <p className="fp-hint">Check your inbox for the 6-digit code we sent to <strong>{email}</strong></p>
            <div className="form-group">
              <label htmlFor="fp-code">Reset Code</label>
              <input
                id="fp-code" type="text" placeholder="000000"
                value={code} onChange={(e) => setCode(e.target.value)}
                maxLength={6} autoFocus inputMode="numeric"
                className="fp-code-input"
              />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Verify Code →"}
            </button>
            <button type="button" className="fp-resend" onClick={() => { setStep(1); setCode(""); }}>
              Didn't get the code? Go back
            </button>
          </form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form className="auth-fields" onSubmit={handleResetPass}>
            <p className="fp-hint">Choose a strong new password for your account.</p>
            <div className="form-group">
              <label htmlFor="fp-pass">New Password</label>
              <input
                id="fp-pass" type="password" placeholder="Abc12345"
                value={newPass} onChange={(e) => setNewPass(e.target.value)}
                autoFocus autoComplete="new-password"
              />
              <span className="error-msg" style={{ color: "var(--muted)", fontSize: "12px" }}>
                Must start with uppercase letter, min 6 characters
              </span>
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Reset Password ✓"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
