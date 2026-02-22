import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { signUp } from "../services/supabase";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const requirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
    return requirements;
  };

  const getPasswordStrength = (pwd) => {
    const reqs = validatePassword(pwd);
    const score = Object.values(reqs).filter(Boolean).length;
    if (score <= 2) return { label: "Weak", color: "#e74c3c" };
    if (score <= 4) return { label: "Medium", color: "#f39c12" };
    return { label: "Strong", color: "#27ae60" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const reqs = validatePassword(password);
    if (!reqs.length) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!reqs.uppercase) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!reqs.lowercase) {
      setError("Password must contain at least one lowercase letter");
      return;
    }
    if (!reqs.number) {
      setError("Password must contain at least one number");
      return;
    }
    if (!reqs.special) {
      setError("Password must contain at least one special character");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { data, error } = await signUp(email, password, fullName);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert("Account created! Please check your email to verify your account.");
      navigate("/login");
    }
  };

  const passwordReqs = validatePassword(password);
  const strength = password ? getPasswordStrength(password) : null;

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    container: {
      maxWidth: "500px",
      margin: "5rem auto",
      padding: "0 2rem",
      flexGrow: 1,
    },
    card: {
      background: "white",
      padding: "3rem",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    },
    title: {
      fontSize: "2.5rem",
      color: "#5A3A79",
      textAlign: "center",
      marginBottom: "2rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#5A3A79",
    },
    input: {
      padding: "1rem",
      fontSize: "1rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
      transition: "border-color 0.3s",
    },
    passwordWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    passwordInput: {
      padding: "1rem",
      paddingRight: "3rem",
      fontSize: "1rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
      width: "100%",
      transition: "border-color 0.3s",
    },
    eyeIcon: {
      position: "absolute",
      right: "1rem",
      cursor: "pointer",
      fontSize: "1.2rem",
      userSelect: "none",
    },
    requirements: {
      fontSize: "0.85rem",
      marginTop: "0.5rem",
    },
    requirement: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.3rem",
    },
    strengthBar: {
      height: "6px",
      borderRadius: "3px",
      background: "#e0e0e0",
      marginTop: "0.5rem",
      overflow: "hidden",
    },
    strengthFill: {
      height: "100%",
      transition: "all 0.3s",
    },
    strengthLabel: {
      fontSize: "0.85rem",
      fontWeight: "600",
      marginTop: "0.3rem",
    },
    error: {
      background: "#ffebee",
      color: "#c62828",
      padding: "1rem",
      borderRadius: "8px",
      fontSize: "0.95rem",
    },
    button: {
      background: "#6B4A8A",
      color: "white",
      border: "none",
      padding: "1.2rem",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s",
      marginTop: "1rem",
    },
    footer: {
      textAlign: "center",
      marginTop: "2rem",
      color: "#6b7e85",
    },
    link: {
      color: "#6B4A8A",
      textDecoration: "none",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Create Account</h1>

          {error && <div style={styles.error}>{error}</div>}

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                style={styles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  style={styles.passwordInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  style={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>

              {password && (
                <>
                  <div style={styles.strengthBar}>
                    <div
                      style={{
                        ...styles.strengthFill,
                        width: `${(Object.values(passwordReqs).filter(Boolean).length / 5) * 100}%`,
                        background: strength.color,
                      }}
                    />
                  </div>
                  <div
                    style={{ ...styles.strengthLabel, color: strength.color }}
                  >
                    {strength.label}
                  </div>

                  <div style={styles.requirements}>
                    <div style={styles.requirement}>
                      <span>{passwordReqs.length ? "✅" : "❌"}</span>
                      <span>At least 8 characters</span>
                    </div>
                    <div style={styles.requirement}>
                      <span>{passwordReqs.uppercase ? "✅" : "❌"}</span>
                      <span>One uppercase letter</span>
                    </div>
                    <div style={styles.requirement}>
                      <span>{passwordReqs.lowercase ? "✅" : "❌"}</span>
                      <span>One lowercase letter</span>
                    </div>
                    <div style={styles.requirement}>
                      <span>{passwordReqs.number ? "✅" : "❌"}</span>
                      <span>One number</span>
                    </div>
                    <div style={styles.requirement}>
                      <span>{passwordReqs.special ? "✅" : "❌"}</span>
                      <span>One special character (!@#$%^&*)</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  style={styles.eyeIcon}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div style={styles.footer}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>
              Login
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignupPage;
