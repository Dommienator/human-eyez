import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || "");

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const orderNumber = searchParams.get("order");
  const amount = searchParams.get("amount");

  const handleStripePayment = async () => {
    setProcessing(true);

    try {
      // Call backend to create Stripe checkout session
      const response = await fetch("/api/create-stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          amount: parseFloat(amount),
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        alert("Payment failed: " + error.message);
        setProcessing(false);
      }
    } catch (error) {
      console.error("Stripe error:", error);
      alert("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  const handlePayPalApprove = async (data, actions) => {
    setProcessing(true);

    try {
      // Capture the payment
      const details = await actions.order.capture();

      // Update order status
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "pending",
          payment_method: "paypal",
        })
        .eq("order_number", orderNumber);

      alert("Payment successful!");
      navigate("/my-orders");
    } catch (error) {
      console.error("PayPal error:", error);
      alert("Payment failed.");
      setProcessing(false);
    }
  };

  const handleMpesaPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid phone number (e.g., 0712345678)");
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch("/api/mpesa-stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          amount: parseFloat(amount),
          orderNumber,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          "Check your phone for M-Pesa payment prompt. Enter your PIN to complete payment.",
        );
        // Poll for payment status
        checkMpesaStatus(orderNumber);
      } else {
        alert("M-Pesa request failed: " + result.message);
        setProcessing(false);
      }
    } catch (error) {
      console.error("M-Pesa error:", error);
      alert("M-Pesa payment failed.");
      setProcessing(false);
    }
  };

  const checkMpesaStatus = async (orderNum) => {
    const checkInterval = setInterval(async () => {
      const { data } = await supabase
        .from("orders")
        .select("payment_status")
        .eq("order_number", orderNum)
        .single();

      if (data?.payment_status === "paid") {
        clearInterval(checkInterval);
        alert("Payment confirmed!");
        navigate("/my-orders");
      }
    }, 3000); // Check every 3 seconds

    // Stop checking after 2 minutes
    setTimeout(() => {
      clearInterval(checkInterval);
      setProcessing(false);
    }, 120000);
  };

  // TEMPORARY: Simulate payment for testing
  const handleSimulatePayment = async () => {
    setProcessing(true);

    setTimeout(async () => {
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "pending",
        })
        .eq("order_number", orderNumber);

      setProcessing(false);
      alert("Payment simulated successfully!");
      navigate("/my-orders");
    }, 2000);
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    container: {
      maxWidth: "700px",
      margin: "3rem auto",
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
      fontSize: "2.5rem",
      color: "#5A3A79",
      textAlign: "center",
      marginBottom: "1rem",
    },
    orderInfo: {
      background: "#F0E8F8",
      padding: "1.5rem",
      borderRadius: "12px",
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
      fontSize: "2.5rem",
      color: "#6B4A8A",
      fontWeight: "700",
      textAlign: "center",
      marginTop: "1rem",
    },
    divider: {
      borderTop: "2px solid #ddd",
      margin: "1.5rem 0",
    },
    methodsTitle: {
      fontSize: "1.3rem",
      fontWeight: "700",
      color: "#5A3A79",
      marginBottom: "1.5rem",
      textAlign: "center",
    },
    methodButtons: {
      display: "grid",
      gap: "1rem",
      marginBottom: "2rem",
    },
    methodButton: {
      padding: "1.2rem",
      border: "2px solid #ddd",
      borderRadius: "12px",
      background: "white",
      cursor: "pointer",
      transition: "all 0.3s",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      fontSize: "1.1rem",
      fontWeight: "600",
    },
    methodButtonActive: {
      border: "2px solid #6B4A8A",
      background: "#F0E8F8",
    },
    methodIcon: {
      fontSize: "2rem",
    },
    paymentArea: {
      marginTop: "2rem",
    },
    input: {
      width: "100%",
      padding: "1rem",
      fontSize: "1rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
      marginBottom: "1rem",
    },
    button: {
      width: "100%",
      padding: "1.2rem",
      borderRadius: "30px",
      fontSize: "1.2rem",
      fontWeight: "700",
      cursor: "pointer",
      border: "none",
      marginTop: "1rem",
    },
    primaryButton: {
      background: "#6B4A8A",
      color: "white",
    },
    secondaryButton: {
      background: "#50ADB5",
      color: "white",
    },
    mpesaButton: {
      background: "#00B900",
      color: "white",
    },
    simulateButton: {
      background: "#f39c12",
      color: "white",
      marginTop: "2rem",
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
            <div style={styles.amount}>${amount}</div>
          </div>

          <h2 style={styles.methodsTitle}>Choose Payment Method</h2>

          <div style={styles.methodButtons}>
            <button
              style={{
                ...styles.methodButton,
                ...(paymentMethod === "stripe"
                  ? styles.methodButtonActive
                  : {}),
              }}
              onClick={() => setPaymentMethod("stripe")}
            >
              <span style={styles.methodIcon}>💳</span>
              <div>
                <div>Credit/Debit Card</div>
                <div style={{ fontSize: "0.85rem", color: "#6b7e85" }}>
                  Visa, Mastercard, Amex
                </div>
              </div>
            </button>

            <button
              style={{
                ...styles.methodButton,
                ...(paymentMethod === "paypal"
                  ? styles.methodButtonActive
                  : {}),
              }}
              onClick={() => setPaymentMethod("paypal")}
            >
              <span style={styles.methodIcon}>💰</span>
              <div>
                <div>PayPal</div>
                <div style={{ fontSize: "0.85rem", color: "#6b7e85" }}>
                  Pay with PayPal balance or card
                </div>
              </div>
            </button>

            <button
              style={{
                ...styles.methodButton,
                ...(paymentMethod === "mpesa" ? styles.methodButtonActive : {}),
              }}
              onClick={() => setPaymentMethod("mpesa")}
            >
              <span style={styles.methodIcon}>📱</span>
              <div>
                <div>M-Pesa</div>
                <div style={{ fontSize: "0.85rem", color: "#6b7e85" }}>
                  Kenya mobile money
                </div>
              </div>
            </button>
          </div>

          {paymentMethod === "stripe" && (
            <div style={styles.paymentArea}>
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={handleStripePayment}
                disabled={processing}
              >
                {processing ? "Processing..." : "Pay with Stripe"}
              </button>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div style={styles.paymentArea}>
              <PayPalScriptProvider
                options={{
                  "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID || "test",
                  currency: "USD",
                }}
              >
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: { value: amount },
                          description: `HumanEyez Order ${orderNumber}`,
                        },
                      ],
                    });
                  }}
                  onApprove={handlePayPalApprove}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    alert("Payment failed");
                  }}
                />
              </PayPalScriptProvider>
            </div>
          )}

          {paymentMethod === "mpesa" && (
            <div style={styles.paymentArea}>
              <label
                style={{
                  fontWeight: "600",
                  color: "#5A3A79",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                style={styles.input}
                placeholder="0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <button
                style={{ ...styles.button, ...styles.mpesaButton }}
                onClick={handleMpesaPayment}
                disabled={processing}
              >
                {processing ? "Waiting for payment..." : "Pay with M-Pesa"}
              </button>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#6b7e85",
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                You will receive a prompt on your phone to enter your M-Pesa PIN
              </p>
            </div>
          )}

          {/* TEMPORARY TESTING BUTTON */}
          <button
            style={{ ...styles.button, ...styles.simulateButton }}
            onClick={handleSimulatePayment}
          >
            🧪 Simulate Payment (Testing Only)
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;
