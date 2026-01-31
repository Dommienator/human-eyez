import React from "react";

const OrderForm = ({ formData, onFormChange, onSubmit }) => {
  const styles = {
    container: {
      background: "white",
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#5A3A79",
      marginBottom: "1.5rem",
    },
    row: {
      marginBottom: "1.5rem",
    },
    label: {
      display: "block",
      fontSize: "1rem",
      fontWeight: "600",
      color: "#5A3A79",
      marginBottom: "0.5rem",
    },
    input: {
      width: "100%",
      padding: "0.8rem",
      fontSize: "1rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
      fontFamily: "inherit",
    },
    button: {
      background: "#50ADB5",
      color: "white",
      border: "none",
      padding: "1rem 2rem",
      borderRadius: "30px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
      width: "100%",
      marginTop: "1rem",
      transition: "all 0.3s",
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Your Information</h3>

      <div style={styles.row}>
        <label style={styles.label}>Full Name *</label>
        <input
          type="text"
          style={styles.input}
          value={formData.name}
          onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Email *</label>
        <input
          type="email"
          style={styles.input}
          value={formData.email}
          onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Phone Number (Optional)</label>
        <input
          type="tel"
          style={styles.input}
          value={formData.phone}
          onChange={(e) => onFormChange({ ...formData, phone: e.target.value })}
        />
      </div>

      <button style={styles.button} onClick={onSubmit}>
        Proceed to Payment →
      </button>
    </div>
  );
};

export default OrderForm;
