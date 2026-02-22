import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "../services/supabase";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    navigate("/");
  };

  const styles = {
    header: {
      background: "linear-gradient(135deg, #6B4A8A 0%, #5A3A79 100%)",
      padding: "1rem 2rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    },
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: {
      color: "white",
      fontSize: "1.8rem",
      fontFamily: "Pacifico, cursive",
      textDecoration: "none",
    },
    nav: {
      display: "flex",
      alignItems: "center",
      gap: "2rem",
    },
    link: {
      color: "white",
      textDecoration: "none",
      fontSize: "1rem",
      fontWeight: "500",
      transition: "opacity 0.3s",
    },
    userSection: {
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
    },
    userName: {
      color: "rgba(255,255,255,0.9)",
      fontSize: "0.95rem",
    },
    button: {
      background: "#50ADB5",
      color: "white",
      border: "none",
      padding: "0.6rem 1.5rem",
      borderRadius: "25px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-block",
      transition: "all 0.3s",
    },
    logoutBtn: {
      background: "transparent",
      border: "2px solid white",
      color: "white",
      padding: "0.5rem 1.2rem",
      borderRadius: "25px",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          HumanEyez
        </Link>

        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          <Link to="/track" style={styles.link}>
            Track Order
          </Link>

          {user ? (
            <div style={styles.userSection}>
              <NotificationBell userEmail={user.email} />
              <Link to="/my-orders" style={styles.link}>
                My Orders
              </Link>
              <span style={styles.userName}>
                👤 {user.user_metadata?.full_name || user.email}
              </span>
              <Link to="/order" style={styles.button}>
                Place Order
              </Link>
              <button style={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/order" style={styles.button}>
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
