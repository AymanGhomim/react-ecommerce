import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const BASE = "https://ecommerce.routemisr.com/api/v1/auth";

// ── Login ─────────────────────────────────────────────
function LoginForm({ onSwitch }) {
  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email:    Yup.string().required("Email is required").email("Enter a valid email"),
      password: Yup.string().required("Password is required").min(6, "Min 6 characters"),
    }),
    onSubmit: async (values) => {
      setLoading(true); setApiError("");
      try {
        const res = await axios.post(`${BASE}/signin`, values);
        if (res.data.message === "success") {
          saveToken(res.data.token, { name: res.data.user.name, email: res.data.user.email });
          toast.success(`Welcome back, ${res.data.user.name}! 👋`);
          navigate("/");
        }
      } catch (err) {
        const msg = err.response?.data?.message || "Login failed";
        setApiError(msg);
        toast.error(msg);
      }
      setLoading(false);
    },
  });

  return (
    <div className="auth-fields">
      {apiError && <div className="api-error">{apiError}</div>}
      {[
        { name: "email",    label: "Email",    type: "email",    placeholder: "you@example.com" },
        { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
      ].map(({ name, label, type, placeholder }) => (
        <div key={name} className="form-group">
          <label>{label}</label>
          <input
            type={type} name={name} placeholder={placeholder}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched[name] && formik.errors[name] ? "input-error" : ""}
          />
          {formik.touched[name] && formik.errors[name] && (
            <span className="error-msg">{formik.errors[name]}</span>
          )}
        </div>
      ))}

      <button className="auth-submit" onClick={formik.handleSubmit} disabled={loading}>
        {loading ? <span className="btn-spinner"></span> : "Sign In →"}
      </button>

      <p className="auth-switch">
        Don't have an account?{" "}
        <button className="auth-switch-btn" onClick={onSwitch}>Sign Up</button>
      </p>
    </div>
  );
}

// ── Register ──────────────────────────────────────────
function RegisterForm({ onSwitch }) {
  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", phone: "", password: "", rePassword: "" },
    validationSchema: Yup.object({
      name:       Yup.string().required("Name is required").min(3, "Min 3 chars").max(20, "Max 20 chars"),
      email:      Yup.string().required("Email is required").email("Enter a valid email"),
      phone:      Yup.string().required("Phone is required").matches(/^01[1250][0-9]{8}$/, "Enter a valid Egyptian phone"),
      password:   Yup.string().required("Password is required").matches(/^[A-Z][a-z0-9]{5,}$/, "Must start with uppercase, min 6 chars"),
      rePassword: Yup.string().required("Confirm your password").oneOf([Yup.ref("password")], "Passwords don't match"),
    }),
    onSubmit: async (values) => {
      setLoading(true); setApiError("");
      try {
        const res = await axios.post(`${BASE}/signup`, values);
        if (res.data.message === "success") {
          saveToken(res.data.token, { name: res.data.user.name, email: res.data.user.email });
          toast.success("Account created! 🎉");
          navigate("/");
        }
      } catch (err) {
        const msg = err.response?.data?.message || "Registration failed";
        setApiError(msg);
        toast.error(msg);
      }
      setLoading(false);
    },
  });

  return (
    <div className="auth-fields">
      {apiError && <div className="api-error">{apiError}</div>}
      {[
        { name: "name",       label: "Full Name",        type: "text",     placeholder: "John Doe" },
        { name: "email",      label: "Email",            type: "email",    placeholder: "you@example.com" },
        { name: "phone",      label: "Phone",            type: "tel",      placeholder: "01xxxxxxxxx" },
        { name: "password",   label: "Password",         type: "password", placeholder: "Abc12345" },
        { name: "rePassword", label: "Confirm Password", type: "password", placeholder: "••••••••" },
      ].map(({ name, label, type, placeholder }) => (
        <div key={name} className="form-group">
          <label>{label}</label>
          <input
            type={type} name={name} placeholder={placeholder}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched[name] && formik.errors[name] ? "input-error" : ""}
          />
          {formik.touched[name] && formik.errors[name] && (
            <span className="error-msg">{formik.errors[name]}</span>
          )}
        </div>
      ))}

      <button className="auth-submit" onClick={formik.handleSubmit} disabled={loading}>
        {loading ? <span className="btn-spinner"></span> : "Create Account →"}
      </button>

      <p className="auth-switch">
        Already have an account?{" "}
        <button className="auth-switch-btn" onClick={onSwitch}>Sign In</button>
      </p>
    </div>
  );
}

// ── Auth Page Shell ───────────────────────────────────
export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Store</div>
        <p className="auth-subtitle">
          {mode === "login" ? "Sign in to your account" : "Create a new account"}
        </p>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}>Sign In</button>
          <button className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}>Sign Up</button>
        </div>

        {mode === "login"
          ? <LoginForm onSwitch={() => setMode("register")} />
          : <RegisterForm onSwitch={() => setMode("login")} />
        }
      </div>
    </div>
  );
}
