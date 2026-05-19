import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export function Login({ setPage }) {
  const { login, showToast } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) return showToast("Fill all fields", "error");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) return showToast(data.message, "error");
      login(data);
      showToast(`Welcome back, ${data.name}! 👋`);
      setPage({ name: "home" });
    } catch { showToast("Server error", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">🛒 TrendBazaar</div>
        <h2>Welcome Back</h2>
        <p className="auth-sub">Sign in to your account</p>
        <div className="demo-box">
          <b>Demo accounts:</b><br />
          Admin: admin@trendbazaar.com / admin123<br />
          User: user@trendbazaar.com / user123
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input className="input" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" />
          <input className="input" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} type="password" onKeyDown={e => e.key === "Enter" && submit()} />
          <button className="btn btn-primary btn-lg" style={{ justifyContent: "center" }} onClick={submit} disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </div>
        <p className="auth-switch">Don't have an account? <button onClick={() => setPage({ name: "register" })}>Sign Up</button></p>
      </div>
    </div>
  );
}

export function Register({ setPage }) {
  const { login, showToast } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || !form.password) return showToast("Fill all fields", "error");
    if (form.password.length < 6) return showToast("Password min 6 chars", "error");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) return showToast(data.message, "error");
      login(data);
      showToast(`Welcome to TrendBazaar, ${data.name}! 🎉`);
      setPage({ name: "home" });
    } catch { showToast("Server error", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">🛒 TrendBazaar</div>
        <h2>Create Account</h2>
        <p className="auth-sub">Join millions of shoppers</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input className="input" placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input className="input" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" />
          <input className="input" placeholder="Password (min 6 chars)" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} type="password" />
          <button className="btn btn-accent btn-lg" style={{ justifyContent: "center" }} onClick={submit} disabled={loading}>
            {loading ? "Creating..." : "Create Account →"}
          </button>
        </div>
        <p className="auth-switch">Already have an account? <button onClick={() => setPage({ name: "login" })}>Sign In</button></p>
      </div>
    </div>
  );
}
