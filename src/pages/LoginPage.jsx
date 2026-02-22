import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { signIn } from "../services/supabase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const pendingOrder = sessionStorage.getItem("pendingOrder");
      if (pendingOrder) {
        navigate("/order");
      } else {
        navigate("/");
      }
    }
  };

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
    forgotPassword: {
      textAlign: "right",
      marginTop: "-0.5rem",
    },
    forgotLink: {
      color: "#6B4A8A",
      textDecoration: "none",
      fontSize: "0.9rem",
      fontWeight: "600",
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
          <h1 style={styles.title}>Welcome Back</h1>

          {error && <div style={styles.error}>{error}</div>}

          <form style={styles.form} onSubmit={handleSubmit}>
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
              <div style={styles.forgotPassword}>
                <Link to="/forgot-password" style={styles.forgotLink}>
                  Forgot password?
                </Link>
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={styles.footer}>
            Don't have an account?{" "}
            <Link to="/signup" style={styles.link}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
