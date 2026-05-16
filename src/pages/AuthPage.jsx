import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function AuthPage() {
  const { login, register } = useContext(AuthContext);
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validateLogin = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Password must be 6+ chars";
    return e;
  };

  const validateRegister = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Password must be 6+ chars";
    if (form.confirm !== form.password) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = async () => {
    const errs = mode === "login" ? validateLogin() : validateRegister();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (mode === "login") {
      const res = login(form.email, form.password);
      if (!res.success) {
        setErrors({ password: res.error });
        toast.error(res.error);
      } else {
        toast.success("Welcome back! 👋");
      }
    } else {
      const res = register(form.name, form.email, form.password);
      if (!res.success) {
        setErrors({ email: res.error });
        toast.error(res.error);
      } else {
        toast.success("Account created! 🎉");
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">Store</div>
        <p className="auth-subtitle">
          {mode === "login" ? "Sign in to your account" : "Create a new account"}
        </p>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => { setMode("login"); setErrors({}); }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => { setMode("register"); setErrors({}); }}
          >
            Sign Up
          </button>
        </div>

        {/* Demo hint */}
        {mode === "login" && (
          <div className="demo-hint">
            <span>Demo:</span> user@store.com / 123456
          </div>
        )}

        {/* Fields */}
        <div className="auth-fields">
          {mode === "register" && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                className={errors.confirm ? "input-error" : ""}
              />
              {errors.confirm && <span className="error-msg">{errors.confirm}</span>}
            </div>
          )}
        </div>

        <button
          className="auth-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="btn-spinner"></span>
          ) : mode === "login" ? "Sign In →" : "Create Account →"}
        </button>

        <p className="auth-switch">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            className="auth-switch-btn"
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setErrors({}); }}
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
