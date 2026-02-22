import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase, createNotification } from "../services/supabase";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || "");

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const amount = searchParams.get("amount");
  const [isLocal] = useState(window.location.hostname === "localhost");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState("");

  const handleStripePayment = async () => {
    setProcessing(true);
    setSelectedMethod("stripe");

    try {
      const orderDataString = sessionStorage.getItem("orderToCreate");
      if (!orderDataString) {
        alert("Order data not found");
        navigate("/order");
        return;
      }

      const orderData = JSON.parse(orderDataString);

      // Create Stripe checkout session
      const response = await fetch("/api/create-stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          orderData: orderData,
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe error:", error);
        alert("Payment failed. Please try again.");
        setProcessing(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  const handleMpesaPayment = async () => {
    if (!mpesaPhone || mpesaPhone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    setProcessing(true);
    setSelectedMethod("mpesa");

    try {
      const orderDataString = sessionStorage.getItem("orderToCreate");
      if (!orderDataString) {
        alert("Order data not found");
        navigate("/order");
        return;
      }

      const orderData = JSON.parse(orderDataString);

      // Initiate M-Pesa STK Push
      const response = await fetch("/api/mpesa-stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: mpesaPhone,
          amount: parseFloat(amount),
          orderNumber: "PENDING", // Will be created after payment
          orderData: orderData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          "✅ M-Pesa prompt sent to your phone! Enter your PIN to complete payment.",
        );
        // Poll for payment confirmation
        startMpesaPolling(result.checkoutRequestID, orderData);
      } else {
        alert("M-Pesa payment failed: " + result.message);
        setProcessing(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  const startMpesaPolling = (checkoutRequestID, orderData) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds

    const pollInterval = setInterval(async () => {
      attempts++;

      try {
        // Check payment status (you'd need to create this endpoint)
        const response = await fetch(
          `/api/mpesa-check-status?id=${checkoutRequestID}`,
        );
        const result = await response.json();

        if (result.status === "completed") {
          clearInterval(pollInterval);
          await createOrderAfterPayment(orderData);
        } else if (result.status === "failed" || attempts >= maxAttempts) {
          clearInterval(pollInterval);
          alert("Payment failed or timed out");
          setProcessing(false);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 1000);
  };

  const simulatePayment = async () => {
    setProcessing(true);
    setSelectedMethod("simulate");

    const orderDataString = sessionStorage.getItem("orderToCreate");
    if (!orderDataString) {
      alert("Order data not found. Please start over.");
      navigate("/order");
      return;
    }

    const orderData = JSON.parse(orderDataString);
    await createOrderAfterPayment(orderData);
  };

  const createOrderAfterPayment = async (orderData) => {
    console.log("💳 Payment successful, creating order...");

    // Generate order number
    const generateOrderNumber = () => {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 100000);
      const timestamp = Date.now().toString().slice(-5);
      return `HE${year}${random}${timestamp}`;
    };

    const orderNumber = generateOrderNumber();
    console.log("📦 Generated order number:", orderNumber);

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          ...orderData,
          order_number: orderNumber,
          payment_status: "paid",
          status: "in-progress",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ FULL ERROR:", error);
      alert(`Failed to create order. Error: ${error.message}`);
      setProcessing(false);
      return;
    }

    console.log("✅ Order created:", data);

    // Clear session
    sessionStorage.removeItem("orderToCreate");

    // Notify customer
    await createNotification(
      orderData.customer_email,
      "new_order",
      "Order Placed Successfully! 🎉",
      `Your order #${data.order_number} has been received and is being processed.`,
      "/my-orders",
    );

    // Notify admin
    await createNotification(
      "dommienik@yahoo.com",
      "new_order",
      `New Order: #${data.order_number}`,
      `${orderData.customer_email} placed a new order. ${orderData.word_count} words, $${orderData.total_price}`,
      "/admin",
    );

    setTimeout(() => {
      alert("✅ Payment Successful! Your order is being processed.");
      navigate("/my-orders");
    }, 2000);
  };
  const styles = {
    page: { minHeight: "100vh", display: "flex", flexDirection: "column" },
    container: {
      maxWidth: "600px",
      margin: "8rem auto",
      padding: "0 2rem",
      textAlign: "center",
    },
    card: {
      background: "white",
      borderRadius: "16px",
      padding: "3rem",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    },
    title: { fontSize: "2rem", color: "#5A3A79", marginBottom: "1rem" },
    amount: {
      fontSize: "3rem",
      fontWeight: "700",
      color: "#6B4A8A",
      marginBottom: "2rem",
    },
    methodsGrid: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      marginTop: "2rem",
    },
    methodCard: {
      padding: "1.5rem",
      borderRadius: "12px",
      border: "2px solid #e0e0e0",
      background: "white",
      textAlign: "left",
      transition: "all 0.3s",
    },
    methodHeader: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "1rem",
    },
    methodTitle: { fontSize: "1.2rem", fontWeight: "700", color: "#5A3A79" },
    methodButton: {
      padding: "1rem",
      borderRadius: "8px",
      border: "none",
      background: "#6B4A8A",
      color: "white",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
      width: "100%",
      transition: "all 0.3s",
    },
    disabledCard: { opacity: 0.5, background: "#f5f5f5" },
    disabledButton: { background: "#ccc", cursor: "not-allowed" },
    note: {
      fontSize: "0.9rem",
      color: "#6b7e85",
      marginTop: "0.5rem",
      fontStyle: "italic",
    },
    input: {
      padding: "0.8rem",
      borderRadius: "8px",
      border: "2px solid #e0e0e0",
      fontSize: "1rem",
      width: "100%",
      marginBottom: "1rem",
    },
    simulateCard: { border: "2px solid #f39c12", background: "#fff9e6" },
    simulateButton: { background: "#f39c12" },
    spinner: {
      display: "inline-block",
      marginLeft: "0.5rem",
      fontSize: "1rem",
    },
  };

  if (processing) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.container}>
          <div style={styles.card}>
            <h2 style={styles.title}>Processing Payment...</h2>
            <p>Please wait while we process your {selectedMethod} payment.</p>
            <div style={{ fontSize: "3rem", margin: "2rem 0" }}>⏳</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Complete Payment</h1>
          <div style={styles.amount}>${amount}</div>

          <div style={styles.methodsGrid}>
            {/* Stripe */}
            <div
              style={{
                ...styles.methodCard,
                ...(isLocal ? styles.disabledCard : {}),
              }}
            >
              <div style={styles.methodHeader}>
                <span style={{ fontSize: "2rem" }}>💳</span>
                <span style={styles.methodTitle}>Credit/Debit Card</span>
              </div>
              <button
                style={{
                  ...styles.methodButton,
                  ...(isLocal ? styles.disabledButton : {}),
                }}
                onClick={handleStripePayment}
                disabled={isLocal || processing}
              >
                Pay with Stripe
              </button>
              {isLocal && (
                <div style={styles.note}>Available on live site only</div>
              )}
            </div>

            {/* M-Pesa */}
            <div
              style={{
                ...styles.methodCard,
                ...(isLocal ? styles.disabledCard : {}),
              }}
            >
              <div style={styles.methodHeader}>
                <span style={{ fontSize: "2rem" }}>📱</span>
                <span style={styles.methodTitle}>M-Pesa</span>
              </div>
              {!isLocal && (
                <input
                  type="tel"
                  style={styles.input}
                  placeholder="Phone: 0712345678"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                />
              )}
              <button
                style={{
                  ...styles.methodButton,
                  ...(isLocal ? styles.disabledButton : {}),
                }}
                onClick={handleMpesaPayment}
                disabled={isLocal || processing}
              >
                Pay with M-Pesa
              </button>
              {isLocal && (
                <div style={styles.note}>Available on live site only</div>
              )}
            </div>

            {/* PayPal */}
            <div
              style={{
                ...styles.methodCard,
                ...(isLocal ? styles.disabledCard : {}),
              }}
            >
              <div style={styles.methodHeader}>
                <span style={{ fontSize: "2rem" }}>💰</span>
                <span style={styles.methodTitle}>PayPal</span>
              </div>
              <button
                style={{
                  ...styles.methodButton,
                  ...(isLocal ? styles.disabledButton : {}),
                }}
                disabled={isLocal || processing}
              >
                Pay with PayPal
              </button>
              {isLocal && (
                <div style={styles.note}>Available on live site only</div>
              )}
            </div>

            {/* Simulate Payment */}
            <div style={{ ...styles.methodCard, ...styles.simulateCard }}>
              <div style={styles.methodHeader}>
                <span style={{ fontSize: "2rem" }}>🧪</span>
                <span style={styles.methodTitle}>Test Payment</span>
              </div>
              <button
                style={{ ...styles.methodButton, ...styles.simulateButton }}
                onClick={simulatePayment}
                disabled={processing}
              >
                Simulate Payment (For Testing)
              </button>
              <div style={styles.note}>
                Use this to test the order flow without real payment
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;
