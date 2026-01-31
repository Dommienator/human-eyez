import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import OrdersList from "./OrdersList";
import PricingManager from "./PricingManager";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState("orders");
  const navigate = useNavigate();

  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("adminAuth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
    } else {
      alert("Incorrect password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
    navigate("/");
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#f5f5f5",
    },
    loginBox: {
      maxWidth: "400px",
      margin: "10rem auto",
      background: "white",
      padding: "3rem",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    },
    title: {
      fontSize: "2rem",
      color: "#5A3A79",
      marginBottom: "2rem",
      textAlign: "center",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    input: {
      padding: "1rem",
      fontSize: "1rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
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
    content: {
      padding: "2rem",
      maxWidth: "1400px",
      margin: "0 auto",
    },
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <form style={styles.loginBox} onSubmit={handleLogin}>
          <h2 style={styles.title}>Admin Login</h2>
          <div style={styles.form}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <AdminHeader
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
      />

      <div style={styles.content}>
        {currentView === "orders" && <OrdersList />}
        {currentView === "pricing" && <PricingManager />}
        {currentView === "services" && (
          <div>Services Manager (Coming Soon)</div>
        )}
      </div>
    </div>
  );
};

export default Admin;
