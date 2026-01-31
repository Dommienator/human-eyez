import React from "react";

const Footer = () => {
  const styles = {
    footer: {
      background: "#404c50",
      color: "white",
      padding: "3rem 0 1.5rem",
      marginTop: "auto",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 2rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "2rem",
      marginBottom: "2rem",
    },
    section: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    title: {
      fontSize: "1.2rem",
      fontWeight: "700",
      marginBottom: "0.5rem",
      color: "#50ADB5",
    },
    text: {
      color: "#9aa8af",
      lineHeight: "1.6",
    },
    link: {
      color: "#9aa8af",
      textDecoration: "none",
      transition: "color 0.3s",
    },
    bottom: {
      borderTop: "1px solid #6b7e85",
      paddingTop: "1.5rem",
      textAlign: "center",
      color: "#9aa8af",
      fontSize: "0.9rem",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          <div style={styles.section}>
            <h3 style={styles.title}>HumanEyez</h3>
            <p style={styles.text}>
              Transform AI-generated text into authentic human writing. 0% AI
              detection guaranteed.
            </p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.title}>Services</h3>
            <a href="#" style={styles.link}>
              Academic Writing
            </a>
            <a href="#" style={styles.link}>
              SEO Content
            </a>
            <a href="#" style={styles.link}>
              Business Writing
            </a>
            <a href="#" style={styles.link}>
              Creative Content
            </a>
          </div>

          <div style={styles.section}>
            <h3 style={styles.title}>Contact</h3>
            <p style={styles.text}>Email: support@humaneyes.com</p>
            <p style={styles.text}>Phone: +254 700 000 000</p>
          </div>
        </div>

        <div style={styles.bottom}>
          <p>&copy; 2024 HumanEyez. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
