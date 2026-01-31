import React from "react";

const AdminHeader = ({ currentView, setCurrentView, onLogout }) => {
  const styles = {
    header: {
      background: "linear-gradient(135deg, #6B4A8A 0%, #5A3A79 100%)",
      padding: "1.5rem 2rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      color: "white",
      fontSize: "1.8rem",
      fontFamily: "Pacifico, cursive",
    },
    nav: {
      display: "flex",
      gap: "1rem",
      alignItems: "center",
    },
    navButton: {
      background: "transparent",
      border: "none",
      color: "white",
      padding: "0.7rem 1.5rem",
      borderRadius: "20px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
    },
    activeButton: {
      background: "rgba(255,255,255,0.2)",
    },
    logoutButton: {
      background: "#E67E50",
      color: "white",
      border: "none",
      padding: "0.7rem 1.5rem",
      borderRadius: "20px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <h1 style={styles.title}>HumanEyez Admin</h1>

        <div style={styles.nav}>
          <button
            style={{
              ...styles.navButton,
              ...(currentView === "orders" ? styles.activeButton : {}),
            }}
            onClick={() => setCurrentView("orders")}
          >
            Orders
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(currentView === "pricing" ? styles.activeButton : {}),
            }}
            onClick={() => setCurrentView("pricing")}
          >
            Pricing
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(currentView === "services" ? styles.activeButton : {}),
            }}
            onClick={() => setCurrentView("services")}
          >
            Services
          </button>
          <button style={styles.logoutButton} onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
