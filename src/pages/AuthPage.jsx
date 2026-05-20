import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik }      from "formik";
import * as Yup           from "yup";
import axios              from "axios";
import { AuthContext }    from "../context/AuthContext";
import toast              from "react-hot-toast";

const BASE = "https://ecommerce.routemisr.com/api/v1/auth";

// ── Login Form ────────────────────────────────────────────
function LoginForm({ onSwitch }) {
  const { saveToken } = useContext(AuthContext);
  const navigate      = useNavigate();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email:    Yup.string().required("Email is required").email("Enter a valid email"),
      password: Yup.string().required("Password is required").min(6, "Min 6 characters"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setApiError("");
      try {
        const res = await axios.post(`${BASE}/signin`, values);
        if (res.data.message === "success") {
          saveToken(res.data.token, {
            name:  res.data.user.name,
            email: res.data.user.email,
          });
          toast.success(`Welcome back, ${res.data.user.name}! 👋`);
          navigate("/");
        }
      } catch (err) {
        const msg = err.response?.data?.message || "Login failed. Please try again.";
        setApiError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  const fields = [
    { name: "email",    label: "Email",    type: "email",    placeholder: "you@example.com" },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••"        },
  ];

  return (
    <div className="auth-fields">
      {apiError && <div className="api-error">{apiError}</div>}

      {fields.map(({ name, label, type, placeholder }) => (
        <div key={name} className="form-group">
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            type={type}
            name={name}
            placeholder={placeholder}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched[name] && formik.errors[name] ? "input-error" : ""}
            autoComplete={name === "password" ? "current-password" : "email"}
          />
          {formik.touched[name] && formik.errors[name] && (
            <span className="error-msg">{formik.errors[name]}</span>
          )}
        </div>
      ))}

      <div className="fp-link-row">
        <Link to="/forgot-password" className="auth-switch-btn">Forgot password?</Link>
      </div>

      <button
        type="button"
        className="auth-submit"
        onClick={formik.handleSubmit}
        disabled={loading}
      >
        {loading ? <span className="btn-spinner" /> : "Sign In →"}
      </button>

      <p className="auth-switch">
        Don&apos;t have an account?{" "}
        <button type="button" className="auth-switch-btn" onClick={onSwitch}>
          Sign Up
        </button>
      </p>
    </div>
  );
}

// ── Register Form ─────────────────────────────────────────
function RegisterForm({ onSwitch }) {
  const { saveToken } = useContext(AuthContext);
  const navigate      = useNavigate();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", phone: "", password: "", rePassword: "" },
    validationSchema: Yup.object({
      name:       Yup.string().required("Name is required").min(3, "Min 3 chars").max(20, "Max 20 chars"),
      email:      Yup.string().required("Email is required").email("Enter a valid email"),
      phone:      Yup.string().required("Phone is required").matches(/^01[1250][0-9]{8}$/, "Enter a valid Egyptian phone"),
      password:   Yup.string().required("Password is required").matches(/^[A-Z][a-z0-9]{5,}$/, "Must start with uppercase letter, min 6 chars"),
      rePassword: Yup.string().required("Please confirm your password").oneOf([Yup.ref("password")], "Passwords don't match"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setApiError("");
      try {
        const res = await axios.post(`${BASE}/signup`, values);
        if (res.data.message === "success") {
          saveToken(res.data.token, {
            name:  res.data.user.name,
            email: res.data.user.email,
          });
          toast.success("Account created! 🎉");
          navigate("/");
        }
      } catch (err) {
        const msg = err.response?.data?.message || "Registration failed. Please try again.";
        setApiError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  const fields = [
    { name: "name",       label: "Full Name",        type: "text",     placeholder: "John Doe",     autoComplete: "name"            },
    { name: "email",      label: "Email",            type: "email",    placeholder: "you@example.com", autoComplete: "email"         },
    { name: "phone",      label: "Phone",            type: "tel",      placeholder: "01xxxxxxxxx",  autoComplete: "tel"             },
    { name: "password",   label: "Password",         type: "password", placeholder: "Abc12345",     autoComplete: "new-password"    },
    { name: "rePassword", label: "Confirm Password", type: "password", placeholder: "••••••••",     autoComplete: "new-password"    },
  ];

  return (
    <div className="auth-fields">
      {apiError && <div className="api-error">{apiError}</div>}

      {fields.map(({ name, label, type, placeholder, autoComplete }) => (
        <div key={name} className="form-group">
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            type={type}
            name={name}
            placeholder={placeholder}
            autoComplete={autoComplete}
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

      <button
        type="button"
        className="auth-submit"
        onClick={formik.handleSubmit}
        disabled={loading}
      >
        {loading ? <span className="btn-spinner" /> : "Create Account →"}
      </button>

      <p className="auth-switch">
        Already have an account?{" "}
        <button type="button" className="auth-switch-btn" onClick={onSwitch}>
          Sign In
        </button>
      </p>
    </div>
  );
}

// ── Auth Page Shell ───────────────────────────────────────
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
          <button
            type="button"
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            Sign Up
          </button>
        </div>

        {mode === "login"
          ? <LoginForm    onSwitch={() => setMode("register")} />
          : <RegisterForm onSwitch={() => setMode("login")}    />
        }
      </div>
    </div>
  );
}
