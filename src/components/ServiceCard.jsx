import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const styles = {
    card: {
      background: isHovered
        ? "linear-gradient(135deg, #7A5A9A 0%, #6B4A8A 100%)"
        : "linear-gradient(135deg, #6B4A8A 0%, #5A3A79 100%)",
      borderRadius: "16px",
      padding: "2rem",
      color: "white",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: isHovered
        ? "0 12px 24px rgba(107, 74, 138, 0.4)"
        : "0 4px 12px rgba(0, 0, 0, 0.1)",
      transform: isHovered ? "translateY(-5px)" : "translateY(0)",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      minHeight: "280px",
    },
    icon: {
      fontSize: "3rem",
      marginBottom: "0.5rem",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "700",
      marginBottom: "0.5rem",
      color: "white",
    },
    description: {
      fontSize: "1rem",
      lineHeight: "1.6",
      color: "rgba(255,255,255,0.9)",
      flexGrow: 1,
    },
    pricing: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#50ADB5",
      marginTop: "0.5rem",
    },
    button: {
      background: "white",
      color: "#6B4A8A",
      border: "none",
      padding: "0.8rem 1.5rem",
      borderRadius: "25px",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s",
      marginTop: "1rem",
    },
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate("/order")}
    >
      <div style={styles.icon}>{service.icon}</div>
      <h3 style={styles.title}>{service.title}</h3>
      <p style={styles.description}>{service.description}</p>
      <p style={styles.pricing}>{service.pricing}</p>
      <button style={styles.button}>Get Started →</button>
    </div>
  );
};

export default ServiceCard;
