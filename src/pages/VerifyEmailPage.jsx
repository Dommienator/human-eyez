import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyCode, resendVerificationCode } from "../services/verification";
import { supabase } from "../services/supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";

const VerifyEmailPage = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const userName = location.state?.userName || "";

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (code.length !== 6) {
      setError("Please enter a 6-digit code");
      setLoading(false);
      return;
    }

    const result = await verifyCode(email, code);

    if (result.success) {
      await supabase
        .from("customers")
        .update({ email_verified: true })
        .eq("email", email);

      setSuccess("Email verified! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(result.message || "Verification failed");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    const result = await resendVerificationCode(email, userName);

    if (result.success) {
      setSuccess("New code sent! Check your email.");
    } else {
      setError(result.message);
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
      margin: "5rem auto",
      padding: "3rem",
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      flexGrow: 1,
    },
    icon: {
      fontSize: "4rem",
      textAlign: "center",
      marginBottom: "1rem",
    },
    title: {
      fontSize: "2rem",
      color: "#5A3A79",
      textAlign: "center",
      marginBottom: "1rem",
    },
    subtitle: {
      textAlign: "center",
      color: "#6b7e85",
      marginBottom: "2rem",
    },
    email: {
      fontWeight: "700",
      color: "#6B4A8A",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    label: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#5A3A79",
      textAlign: "center",
    },
    input: {
      padding: "1rem",
      fontSize: "2rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
      fontFamily: "'Courier New', monospace",
      letterSpacing: "0.5rem",
      textAlign: "center",
      fontWeight: "700",
    },
    button: {
      background: "#6B4A8A",
      color: "white",
      border: "none",
      padding: "1rem",
      borderRadius: "30px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
    },
    error: {
      background: "#ffebee",
      color: "#c62828",
      padding: "1rem",
      borderRadius: "8px",
      textAlign: "center",
    },
    success: {
      background: "#e8f5e9",
      color: "#2e7d32",
      padding: "1rem",
      borderRadius: "8px",
      textAlign: "center",
    },
    resendSection: {
      textAlign: "center",
      marginTop: "2rem",
      color: "#6b7e85",
    },
    resendButton: {
      background: "none",
      border: "none",
      color: "#6B4A8A",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "underline",
      fontSize: "1rem",
    },
  };

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.container}>
        <div style={styles.icon}>📧</div>
        <h1 style={styles.title}>Verify Your Email</h1>
        <p style={styles.subtitle}>
          We sent a 6-digit code to
          <br />
          <span style={styles.email}>{email}</span>
        </p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form style={styles.form} onSubmit={handleVerify}>
          <label style={styles.label}>Enter Verification Code</label>
          <input
            type="text"
            style={styles.input}
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="000000"
            maxLength="6"
            required
            autoFocus
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div style={styles.resendSection}>
          <p>Didn't receive the code?</p>
          <button style={styles.resendButton} onClick={handleResend}>
            Resend Code
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VerifyEmailPage;
