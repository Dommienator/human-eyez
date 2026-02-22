import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
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
      marginBottom: "1rem",
    },
    subtitle: {
      fontSize: "1rem",
      color: "#6b7e85",
      textAlign: "center",
      marginBottom: "2rem",
      lineHeight: "1.6",
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
    error: {
      background: "#ffebee",
      color: "#c62828",
      padding: "1rem",
      borderRadius: "8px",
      fontSize: "0.95rem",
    },
    success: {
      background: "#e8f5e9",
      color: "#2e7d32",
      padding: "2rem",
      borderRadius: "8px",
      fontSize: "0.95rem",
      textAlign: "center",
      lineHeight: "1.6",
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
    backLink: {
      textAlign: "center",
      marginTop: "2rem",
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
          <h1 style={styles.title}>Reset Password</h1>
          <p style={styles.subtitle}>
            Enter your email and we'll send you a link to reset your password.
          </p>

          {sent ? (
            <div style={styles.success}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
              <strong>Check your email!</strong>
              <br />
              We've sent a password reset link to <strong>{email}</strong>.
              <br />
              Click the link in the email to reset your password.
            </div>
          ) : (
            <>
              {error && <div style={styles.error}>{error}</div>}

              <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
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
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}

          <div style={styles.backLink}>
            <Link to="/login" style={styles.link}>
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
