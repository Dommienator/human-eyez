import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Initialize Stripe (will work when you add real key to .env.local)
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY || "pk_test_placeholder",
);

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const orderNumber = searchParams.get("order");
  const amount = searchParams.get("amount");

  const handleCardPayment = async () => {
    setLoading(true);

    // For now, simulate payment
    // TODO: Integrate real Stripe Checkout
    setTimeout(() => {
      alert("Payment successful! (Demo mode)");
      navigate(`/track?order=${orderNumber}`);
    }, 2000);
  };

  const handleMpesaPayment = async () => {
    setLoading(true);

    // For now, show instructions
    alert(
      "M-Pesa Integration Coming Soon!\n\nFor now, please use card payment or contact support.",
    );
    setLoading(false);
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    container: {
      maxWidth: "600px",
      margin: "5rem auto",
      padding: "0 2rem",
      flexGrow: 1,
    },
    card: {
      background: "white",
      borderRadius: "16px",
      padding: "3rem",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    },
    title: {
      fontSize: "2rem",
      color: "#5A3A79",
      marginBottom: "2rem",
      textAlign: "center",
    },
    orderInfo: {
      background: "#F0E8F8",
      padding: "1.5rem",
      borderRadius: "8px",
      marginBottom: "2rem",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "0.5rem",
    },
    label: {
      fontWeight: "600",
      color: "#6b7e85",
    },
    value: {
      color: "#404c50",
      fontWeight: "600",
    },
    amount: {
      fontSize: "2rem",
      color: "#6B4A8A",
      fontWeight: "700",
    },
    divider: {
      borderTop: "2px solid #ddd",
      margin: "1.5rem 0",
    },
    section: {
      marginBottom: "2rem",
    },
    sectionTitle: {
      fontSize: "1.2rem",
      fontWeight: "700",
      color: "#5A3A79",
      marginBottom: "1rem",
    },
    paymentButton: {
      width: "100%",
      padding: "1.2rem",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
      border: "none",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    },
    cardButton: {
      background: "#6B4A8A",
      color: "white",
    },
    mpesaButton: {
      background: "#50ADB5",
      color: "white",
    },
  };

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Complete Payment</h1>

          <div style={styles.orderInfo}>
            <div style={styles.infoRow}>
              <span style={styles.label}>Order Number:</span>
              <span style={styles.value}>{orderNumber}</span>
            </div>
            <div style={styles.divider}></div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Total Amount:</span>
              <span style={styles.amount}>${amount}</span>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Choose Payment Method</h2>

            <button
              style={{ ...styles.paymentButton, ...styles.cardButton }}
              onClick={handleCardPayment}
              disabled={loading}
            >
              💳 Pay with Card (Stripe)
            </button>

            <button
              style={{ ...styles.paymentButton, ...styles.mpesaButton }}
              onClick={handleMpesaPayment}
              disabled={loading}
            >
              📱 Pay with M-Pesa
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;
