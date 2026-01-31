import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "../services/supabase";

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
      padding: "1rem 0",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    nav: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: {
      fontSize: "2rem",
      fontFamily: "Pacifico, cursive",
      color: "white",
      textDecoration: "none",
    },
    navLinks: {
      display: "flex",
      gap: "2rem",
      alignItems: "center",
    },
    link: {
      color: "white",
      textDecoration: "none",
      fontSize: "1rem",
      fontWeight: "600",
      transition: "color 0.3s",
    },
    button: {
      background: "#50ADB5",
      color: "white",
      border: "none",
      padding: "0.7rem 1.5rem",
      borderRadius: "25px",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s",
      textDecoration: "none",
      display: "inline-block",
    },
    userSection: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    userName: {
      color: "white",
      fontSize: "0.9rem",
    },
    logoutBtn: {
      background: "transparent",
      color: "white",
      border: "1px solid white",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      fontSize: "0.9rem",
      cursor: "pointer",
    },
  };

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
          HumanEyez
        </Link>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          <Link to="/track" style={styles.link}>
            Track Order
          </Link>

          {user ? (
            <div style={styles.userSection}>
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
