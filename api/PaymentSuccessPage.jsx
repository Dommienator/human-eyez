import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderNumber = searchParams.get("order");

  useEffect(() => {
    setTimeout(() => {
      navigate("/my-orders");
    }, 3000);
  }, [navigate]);

  const styles = {
    page: { minHeight: "100vh", display: "flex", flexDirection: "column" },
    container: {
      maxWidth: "600px",
      margin: "10rem auto",
      padding: "0 2rem",
      textAlign: "center",
      flexGrow: 1,
    },
    icon: { fontSize: "6rem", marginBottom: "2rem" },
    title: {
      fontSize: "3rem",
      color: "#27ae60",
      fontWeight: "700",
      marginBottom: "1rem",
    },
    text: { fontSize: "1.2rem", color: "#6b7e85", marginBottom: "0.5rem" },
    orderNumber: {
      fontSize: "1.5rem",
      color: "#6B4A8A",
      fontWeight: "700",
      margin: "2rem 0",
    },
  };

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <div style={styles.icon}>✅</div>
        <h1 style={styles.title}>Payment Successful!</h1>
        <p style={styles.text}>Thank you for your order</p>
        <div style={styles.orderNumber}>Order #{orderNumber}</div>
        <p style={styles.text}>Redirecting to your orders...</p>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
