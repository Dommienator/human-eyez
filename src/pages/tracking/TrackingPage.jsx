import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getOrderByNumber } from "../../services/supabase";

const TrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await getOrderByNumber(orderNumber);

    if (!result) {
      setError("Order not found. Please check your order number.");
      setOrder(null);
    } else {
      setOrder(result);
    }

    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f39c12";
      case "in-progress":
        return "#3498db";
      case "completed":
        return "#27ae60";
      case "delivered":
        return "#8FB569";
      default:
        return "#6b7e85";
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    container: {
      maxWidth: "800px",
      margin: "5rem auto",
      padding: "0 2rem",
      flexGrow: 1,
    },
    title: {
      fontSize: "clamp(2rem, 5vw, 3rem)",
      textAlign: "center",
      color: "#5A3A79",
      marginBottom: "3rem",
    },
    form: {
      background: "white",
      padding: "3rem",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      marginBottom: "2rem",
    },
    inputGroup: {
      marginBottom: "2rem",
    },
    label: {
      display: "block",
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#5A3A79",
      marginBottom: "0.5rem",
    },
    input: {
      width: "100%",
      padding: "1rem",
      fontSize: "1.1rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
      fontFamily: "inherit",
    },
    button: {
      width: "100%",
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
      marginTop: "1rem",
    },
    orderCard: {
      background: "white",
      padding: "3rem",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    },
    orderHeader: {
      borderBottom: "2px solid #ddd",
      paddingBottom: "1.5rem",
      marginBottom: "2rem",
    },
    orderNumber: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#5A3A79",
      marginBottom: "0.5rem",
    },
    statusBadge: {
      display: "inline-block",
      padding: "0.5rem 1.5rem",
      borderRadius: "20px",
      fontSize: "1rem",
      fontWeight: "600",
      color: "white",
      textTransform: "capitalize",
    },
    orderDetails: {
      display: "grid",
      gap: "1.5rem",
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 0",
      borderBottom: "1px solid #f0f0f0",
    },
    detailLabel: {
      fontWeight: "600",
      color: "#6b7e85",
    },
    detailValue: {
      color: "#404c50",
      fontWeight: "600",
    },
    downloadButton: {
      background: "#50ADB5",
      color: "white",
      border: "none",
      padding: "1rem 2rem",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "2rem",
      width: "100%",
    },
  };

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.container}>
        <h1 style={styles.title}>Track Your Order</h1>

        <form style={styles.form} onSubmit={handleTrack}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Order Number</label>
            <input
              type="text"
              style={styles.input}
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g., HE2024001"
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Searching..." : "Track Order"}
          </button>

          {error && <div style={styles.error}>{error}</div>}
        </form>

        {order && (
          <div style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div style={styles.orderNumber}>Order #{order.order_number}</div>
              <span
                style={{
                  ...styles.statusBadge,
                  background: getStatusColor(order.status),
                }}
              >
                {order.status}
              </span>
            </div>

            <div style={styles.orderDetails}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Service</span>
                <span style={styles.detailValue}>{order.service_category}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Tier</span>
                <span style={styles.detailValue}>{order.service_tier}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Word Count</span>
                <span style={styles.detailValue}>{order.word_count} words</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Total Price</span>
                <span style={styles.detailValue}>${order.total_price}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Submitted</span>
                <span style={styles.detailValue}>
                  {new Date(order.submitted_at).toLocaleDateString()}
                </span>
              </div>
              {order.due_date && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Due Date</span>
                  <span style={styles.detailValue}>
                    {new Date(order.due_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {order.status === "completed" || order.status === "delivered" ? (
              <button style={styles.downloadButton}>
                Download Humanized Content
              </button>
            ) : (
              <div
                style={{
                  marginTop: "2rem",
                  textAlign: "center",
                  color: "#6b7e85",
                }}
              >
                Your order is being processed. You'll be notified when it's
                ready.
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TrackingPage;
