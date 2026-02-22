import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const reqs = validatePassword(password);
    if (!Object.values(reqs).every(Boolean)) {
      setError("Password does not meet all requirements");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert("Password updated successfully!");
      navigate("/login");
    }
  };

  const passwordReqs = validatePassword(password);

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    container: {
      maxWidth: "500px",
      margin: "8rem auto",
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
  };

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Set New Password</h1>

          {error && <div style={styles.error}>{error}</div>}

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
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
                    <span>One special character</span>
                  </div>
                </div>
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
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
