import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Profile() {
  const { user, saveToken, token } = useContext(AuthContext);
  const [activeTab, setActiveTab]  = useState("profile");
  const [loading, setLoading]      = useState(false);

  // ── Update profile ─────────────────────────
  const profileFormik = useFormik({
    initialValues: { name: user?.name || "", email: user?.email || "", phone: "" },
    validationSchema: Yup.object({
      name:  Yup.string().required("Name required").min(3),
      email: Yup.string().required("Email required").email(),
      phone: Yup.string().matches(/^01[1250][0-9]{8}$/, "Enter a valid Egyptian phone").optional(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await api.put("/users/updateMe", values);
        if (res.data.message === "success" || res.status === 200) {
          saveToken(token, { name: values.name, email: values.email });
          toast.success("Profile updated! ✅");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Update failed");
      } finally { setLoading(false); }
    },
  });

  // ── Change password ─────────────────────────
  const passFormik = useFormik({
    initialValues: { currentPassword: "", password: "", rePassword: "" },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password required"),
      password:        Yup.string().required("New password required").matches(/^[A-Z][a-z0-9]{5,}$/, "Start with uppercase, min 6 chars"),
      rePassword:      Yup.string().required("Confirm password").oneOf([Yup.ref("password")], "Passwords don't match"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await api.put("/users/changeMyPassword", values);
        if (res.data.token) {
          saveToken(res.data.token, user);
          toast.success("Password changed! 🔐");
          passFormik.resetForm();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to change password");
      } finally { setLoading(false); }
    },
  });

  const TABS = [
    { id: "profile",  label: "👤 Profile Info"   },
    { id: "password", label: "🔐 Change Password" },
    { id: "stats",    label: "📊 My Stats"        },
  ];

  const orders   = JSON.parse(localStorage.getItem("orders")   || "[]");
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar-lg">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`profile-tab ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="profile-body">
        {/* Profile Info */}
        {activeTab === "profile" && (
          <div className="profile-form-card">
            <h2>Profile Information</h2>

            {[
              { name: "name",  label: "Full Name", type: "text",  placeholder: "John Doe",         auto: "name"  },
              { name: "email", label: "Email",     type: "email", placeholder: "john@example.com", auto: "email" },
              { name: "phone", label: "Phone",     type: "tel",   placeholder: "01xxxxxxxxx",      auto: "tel"   },
            ].map(({ name, label, type, placeholder, auto }) => (
              <div key={name} className="form-group">
                <label htmlFor={name}>{label}</label>
                <input
                  id={name} type={type} name={name}
                  placeholder={placeholder} autoComplete={auto}
                  value={profileFormik.values[name]}
                  onChange={profileFormik.handleChange}
                  onBlur={profileFormik.handleBlur}
                  className={profileFormik.touched[name] && profileFormik.errors[name] ? "input-error" : ""}
                />
                {profileFormik.touched[name] && profileFormik.errors[name] && (
                  <span className="error-msg">{profileFormik.errors[name]}</span>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn-primary profile-save-btn"
              onClick={profileFormik.handleSubmit}
              disabled={loading}
            >
              {loading ? <span className="btn-spinner" /> : "Save Changes"}
            </button>
          </div>
        )}

        {/* Change Password */}
        {activeTab === "password" && (
          <div className="profile-form-card">
            <h2>Change Password</h2>

            {[
              { name: "currentPassword", label: "Current Password", placeholder: "••••••••" },
              { name: "password",        label: "New Password",     placeholder: "Abc12345" },
              { name: "rePassword",      label: "Confirm Password", placeholder: "••••••••" },
            ].map(({ name, label, placeholder }) => (
              <div key={name} className="form-group">
                <label htmlFor={name}>{label}</label>
                <input
                  id={name} type="password" name={name}
                  placeholder={placeholder} autoComplete="new-password"
                  value={passFormik.values[name]}
                  onChange={passFormik.handleChange}
                  onBlur={passFormik.handleBlur}
                  className={passFormik.touched[name] && passFormik.errors[name] ? "input-error" : ""}
                />
                {passFormik.touched[name] && passFormik.errors[name] && (
                  <span className="error-msg">{passFormik.errors[name]}</span>
                )}
              </div>
            ))}

            <div className="password-rules">
              <p>Password must:</p>
              <ul>
                <li>Start with an uppercase letter</li>
                <li>Be at least 6 characters</li>
                <li>Contain lowercase letters and numbers</li>
              </ul>
            </div>

            <button
              type="button"
              className="btn-primary profile-save-btn"
              onClick={passFormik.handleSubmit}
              disabled={loading}
            >
              {loading ? <span className="btn-spinner" /> : "Change Password"}
            </button>
          </div>
        )}

        {/* Stats */}
        {activeTab === "stats" && (
          <div className="stats-grid">
            {[
              { icon: "📦", label: "Total Orders",    value: orders.length },
              { icon: "❤️", label: "Wishlist Items",  value: wishlist.length },
              { icon: "💰", label: "Total Spent",     value: `${orders.reduce((s, o) => s + (o.total || 0), 0)} EGP` },
              { icon: "⭐", label: "Member Since",    value: "2025" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-card-icon">{s.icon}</div>
                <div className="stat-card-value">{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
