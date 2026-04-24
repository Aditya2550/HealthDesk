import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Stethoscope, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import API from "../api/axios";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email.includes("@"))
      return setError("Enter a valid email address.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", form);
      login(data);
      if (data.role === "admin") navigate("/admin");
      else if (data.role === "doctor") navigate("/doctor");
      else navigate("/patient");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        background: "#f0f4ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stethoscope size={22} color="#fff" />
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.5px",
            }}
          >
            HealthDesk
          </span>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            padding: "36px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "999px",
              padding: "4px 14px",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#3b82f6",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#2563eb",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Welcome back
            </span>
          </div>

          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.5px",
              marginBottom: "4px",
            }}
          >
            Sign in
          </h1>
          <p
            style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "28px" }}
          >
            Your health, managed simply.
          </p>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "12px",
                padding: "12px 16px",
                color: "#ef4444",
                fontSize: "13px",
                fontWeight: 500,
                marginBottom: "20px",
              }}
            >
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                What is your Email address?
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#f9fafb",
                  border: "1.5px solid #d1d5db",
                  borderRadius: "12px",
                  fontSize: "14px",
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#f9fafb",
                  border: "1.5px solid #d1d5db",
                  borderRadius: "12px",
                  fontSize: "14px",
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                background: loading ? "#6b7280" : "#111827",
                color: "#fff",
                fontWeight: 700,
                fontSize: "15px",
                borderRadius: "12px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(17,24,39,0.2)",
              }}
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    style={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  Signing in...
                </>
              ) : (
                <>
                  Continue <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#9ca3af",
              marginTop: "20px",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#2563eb",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign up free
            </Link>
          </p>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#d1d5db",
            marginTop: "24px",
          }}
        >
          © 2026 HealthDesk · Smart Appointment Management
        </p>
      </div>
    </div>
  );
};

export default Login;
