import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import WordCounter from "../../components/order/WordCounter";
import PricingCalculator from "../../components/order/PricingCalculator";
import { getCurrentUser, getPricingByCategory } from "../../services/supabase";

const OrderPage = () => {
  const [user, setUser] = useState(null);
  const [text, setText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [service, setService] = useState("");
  const [tier, setTier] = useState("");
  const [addOns, setAddOns] = useState({
    rushDelivery: false,
    extraRevision: false,
    enhancedFactCheck: false,
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    restorePendingOrder();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const restorePendingOrder = () => {
    const pendingOrder = sessionStorage.getItem("pendingOrder");
    if (pendingOrder) {
      const orderData = JSON.parse(pendingOrder);
      setText(orderData.text || "");
      setService(orderData.service || "");
      setTier(orderData.tier || "");
      setAddOns(
        orderData.addOns || {
          rushDelivery: false,
          extraRevision: false,
          enhancedFactCheck: false,
        },
      );
    }
  };

  const countWords = (str) => {
    if (!str || str.trim() === "") return 0;
    if (str.startsWith("[FILE:")) {
      const match = str.match(/(\d+)\s+words/);
      return match ? parseInt(match[1]) : 0;
    }
    return str.trim().split(/\s+/).length;
  };

  const calculatePrice = async () => {
    if (!service || !tier) return { base: 0, total: 0, turnaround: 0 };

    const pricingData = await getPricingByCategory(service);
    const tierPricing = pricingData.find((p) => p.tier_name === tier);

    if (!tierPricing) return { base: 0, total: 0, turnaround: 0 };

    const wordCount = countWords(text);
    const basePrice = (tierPricing.price_per_1000_words / 1000) * wordCount;
    let totalPrice = basePrice;

    if (addOns.rushDelivery) totalPrice *= 1.5;
    if (addOns.extraRevision) totalPrice += 25;
    if (addOns.enhancedFactCheck) totalPrice += 50;

    const turnaround = addOns.rushDelivery
      ? Math.floor(tierPricing.turnaround_hours / 2)
      : tierPricing.turnaround_hours;

    return {
      base: parseFloat(basePrice.toFixed(2)),
      total: parseFloat(totalPrice.toFixed(2)),
      turnaround,
    };
  };

  const handleSubmit = async () => {
    const wordCount = countWords(text);

    if (!text || wordCount === 0) {
      alert("Please paste your text or upload a file first");
      return;
    }
    if (!service || !tier) {
      alert("Please select service category and tier");
      return;
    }

    if (!user) {
      sessionStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          text,
          uploadedFile: uploadedFile?.url || null,
          wordCount,
          service,
          tier,
          addOns,
        }),
      );
      setShowAuthModal(true);
      return;
    }

    setSubmitting(true);

    try {
      const pricing = await calculatePrice();
      const dueDate = new Date();
      dueDate.setHours(dueDate.getHours() + pricing.turnaround);

      const orderData = {
        customer_id: null,
        customer_email: user.email,
        service_category: service,
        service_tier: tier,
        word_count: wordCount,
        original_text: text.startsWith("[FILE:") ? null : text,
        original_file_url: uploadedFile?.url || null,
        base_price: pricing.base,
        total_price: pricing.total,
        rush_delivery: addOns.rushDelivery,
        extra_revision: addOns.extraRevision,
        enhanced_fact_check: addOns.enhancedFactCheck,
        turnaround_hours: pricing.turnaround,
        due_date: dueDate.toISOString(),
        status: "pending",
        payment_status: "pending",
      };

      // Save order data to session - will be created AFTER payment
      sessionStorage.setItem("orderToCreate", JSON.stringify(orderData));
      sessionStorage.removeItem("pendingOrder");

      console.log("✅ Order data saved to session, redirecting to payment");

      navigate(`/payment?amount=${pricing.total}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = () => {
    sessionStorage.setItem(
      "pendingOrder",
      JSON.stringify({
        text,
        uploadedFile: uploadedFile?.url || null,
        wordCount: countWords(text),
        service,
        tier,
        addOns,
      }),
    );
    navigate("/login");
  };

  const handleSignup = () => {
    sessionStorage.setItem(
      "pendingOrder",
      JSON.stringify({
        text,
        uploadedFile: uploadedFile?.url || null,
        wordCount: countWords(text),
        service,
        tier,
        addOns,
      }),
    );
    navigate("/signup");
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "3rem 2rem",
      flexGrow: 1,
    },
    title: {
      fontSize: "clamp(2rem, 5vw, 3rem)",
      textAlign: "center",
      color: "#5A3A79",
      marginBottom: "1rem",
    },
    subtitle: {
      textAlign: "center",
      fontSize: "1.1rem",
      color: "#6b7e85",
      marginBottom: "3rem",
    },
    userInfo: {
      background: "#e8f5e9",
      padding: "1rem 2rem",
      borderRadius: "8px",
      marginBottom: "2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    userName: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#2e7d32",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "2rem",
    },
    column: {
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
    },
    submitButton: {
      background: "#50ADB5",
      color: "white",
      border: "none",
      padding: "1.2rem 2rem",
      borderRadius: "30px",
      fontSize: "1.2rem",
      fontWeight: "700",
      cursor: "pointer",
      marginTop: "2rem",
      width: "100%",
      boxShadow: "0 4px 12px rgba(80, 173, 181, 0.3)",
      opacity: submitting ? 0.6 : 1,
      transition: "all 0.3s",
    },
    factCheckNote: {
      background: "#fff9e6",
      padding: "1.5rem",
      borderRadius: "8px",
      borderLeft: "4px solid #f39c12",
      marginTop: "2rem",
    },
    factCheckTitle: {
      fontWeight: "700",
      color: "#5A3A79",
      marginBottom: "0.5rem",
    },
    factCheckText: {
      color: "#404c50",
      lineHeight: "1.6",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
    },
    authModal: {
      background: "white",
      borderRadius: "16px",
      padding: "3rem",
      maxWidth: "500px",
      width: "90%",
      textAlign: "center",
    },
    modalTitle: {
      fontSize: "2rem",
      color: "#5A3A79",
      marginBottom: "1rem",
    },
    modalText: {
      fontSize: "1.1rem",
      color: "#404c50",
      marginBottom: "2rem",
      lineHeight: "1.6",
    },
    modalButtons: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    modalButton: {
      padding: "1rem",
      borderRadius: "30px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
      border: "none",
      transition: "all 0.3s",
    },
    loginButton: {
      background: "#6B4A8A",
      color: "white",
    },
    signupButton: {
      background: "#50ADB5",
      color: "white",
    },
    cancelButton: {
      background: "transparent",
      color: "#6b7e85",
      border: "2px solid #6b7e85",
    },
  };

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.container}>
        <h1 style={styles.title}>Place Your Order</h1>
        <p style={styles.subtitle}>
          All orders include professional fact-checking
        </p>

        {user && (
          <div style={styles.userInfo}>
            <span style={styles.userName}>
              👤 Ordering as: {user?.user_metadata?.full_name || user?.email}
            </span>
          </div>
        )}

        <div style={styles.grid}>
          <div style={styles.column}>
            <WordCounter
              text={text}
              onTextChange={setText}
              onFileUpload={setUploadedFile}
            />

            <div style={styles.factCheckNote}>
              <div style={styles.factCheckTitle}>✓ Fact-Checking Included</div>
              <div style={styles.factCheckText}>
                Every order includes thorough fact-checking to verify accuracy,
                cross-reference sources, and ensure logical consistency in your
                content.
              </div>
            </div>
          </div>

          <div style={styles.column}>
            <PricingCalculator
              service={service}
              tier={tier}
              wordCount={countWords(text)}
              addOns={addOns}
              onServiceChange={setService}
              onTierChange={setTier}
              onAddOnsChange={setAddOns}
            />

            <button
              style={styles.submitButton}
              onClick={handleSubmit}
              disabled={submitting}
              onMouseEnter={(e) =>
                !submitting && (e.target.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
            >
              {submitting ? "Processing..." : "Proceed to Payment →"}
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {showAuthModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.authModal}>
            <h2 style={styles.modalTitle}>Almost There!</h2>
            <p style={styles.modalText}>
              Please login or create an account to complete your order. Your
              content and selections will be saved.
            </p>
            <div style={styles.modalButtons}>
              <button
                style={{ ...styles.modalButton, ...styles.loginButton }}
                onClick={handleLogin}
              >
                Login to Existing Account
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.signupButton }}
                onClick={handleSignup}
              >
                Create New Account
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.cancelButton }}
                onClick={() => setShowAuthModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
