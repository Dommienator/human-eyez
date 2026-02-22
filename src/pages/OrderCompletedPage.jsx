import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

const OrderCompletedPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrder();
  }, [orderNumber]);

  const loadOrder = async () => {
    console.log("🔍 Loading order:", orderNumber);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .single();

    console.log("📦 Order data:", data);
    console.log("❌ Error:", error);

    if (error || !data) {
      alert("Order not found");
      navigate("/my-orders");
      return;
    }

    setOrder(data);
    setLoading(false);
  };

  const handleAccept = async () => {
    setSubmitting(true);

    const { error } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", order.id);

    if (error) {
      alert("Failed to accept order");
      setSubmitting(false);
      return;
    }

    alert("✅ Order accepted! Thank you!");
    navigate("/my-orders");
  };

  const handleRequestRevision = async () => {
    const revisionNotes = prompt("What would you like us to revise?");
    if (!revisionNotes) return;

    setSubmitting(true);

    const { error } = await supabase
      .from("orders")
      .update({
        status: "in-revision",
        admin_notes:
          (order.admin_notes || "") + `\n\nREVISION REQUEST: ${revisionNotes}`,
      })
      .eq("id", order.id);

    if (error) {
      alert("Failed to request revision");
      setSubmitting(false);
      return;
    }

    alert("✅ Revision requested!");
    navigate("/my-orders");
  };

  const handleDownload = () => {
    if (order.humanized_file_url) {
      window.open(order.humanized_file_url, "_blank");
    }
  };

  const handleCopyText = () => {
    if (order.humanized_text) {
      navigator.clipboard.writeText(order.humanized_text);
      alert("Text copied!");
    }
  };

  const styles = {
    page: { minHeight: "100vh", display: "flex", flexDirection: "column" },
    container: {
      maxWidth: "900px",
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
    header: { textAlign: "center", marginBottom: "2rem" },
    icon: { fontSize: "4rem", marginBottom: "1rem" },
    title: { fontSize: "2.5rem", color: "#27ae60", marginBottom: "0.5rem" },
    orderNumber: { fontSize: "1.2rem", color: "#6b7e85" },
    section: {
      marginTop: "2rem",
      paddingTop: "2rem",
      borderTop: "2px solid #f0f0f0",
    },
    sectionTitle: {
      fontSize: "1.3rem",
      fontWeight: "700",
      color: "#5A3A79",
      marginBottom: "1rem",
    },
    textBox: {
      background: "#f9f9f9",
      padding: "1.5rem",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
      fontFamily: "monospace",
      fontSize: "0.95rem",
      lineHeight: "1.8",
      maxHeight: "400px",
      overflowY: "auto",
      whiteSpace: "pre-wrap",
    },
    actions: {
      display: "flex",
      gap: "1rem",
      marginTop: "1.5rem",
      flexWrap: "wrap",
    },
    button: {
      padding: "1rem 2rem",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      border: "none",
      transition: "all 0.3s",
      flex: 1,
      minWidth: "180px",
    },
    acceptBtn: { background: "#27ae60", color: "white" },
    revisionBtn: { background: "#f39c12", color: "white" },
    downloadBtn: { background: "#6B4A8A", color: "white" },
    copyBtn: { background: "#50ADB5", color: "white" },
    backBtn: {
      background: "#e0e0e0",
      color: "#404c50",
      flex: "none",
      width: "100%",
    },
    emptyState: { textAlign: "center", padding: "3rem", color: "#6b7e85" },
    debugInfo: {
      background: "#fff9e6",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "2rem",
      fontSize: "0.9rem",
      fontFamily: "monospace",
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.container}>
          <p style={{ textAlign: "center" }}>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const canReview = order.status === "ready-for-review";
  const isCompleted = order.status === "completed";
  const hasContent = order.humanized_text || order.humanized_file_url;

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.icon}>✅</div>
            <h1 style={styles.title}>
              {canReview ? "Ready for Your Review!" : "Order Details"}
            </h1>
            <p style={styles.orderNumber}>Order #{order.order_number}</p>
          </div>

          <div style={styles.debugInfo}>
            <strong>Debug Info:</strong>
            <br />
            Status: {order.status}
            <br />
            Has Text:{" "}
            {order.humanized_text
              ? "Yes (" + order.humanized_text.substring(0, 50) + "...)"
              : "No"}
            <br />
            Has File: {order.humanized_file_url ? "Yes" : "No"}
          </div>

          {order.humanized_text && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>📝 Humanized Content</h2>
              <div style={styles.textBox}>{order.humanized_text}</div>
              <div style={styles.actions}>
                <button
                  style={{ ...styles.button, ...styles.copyBtn }}
                  onClick={handleCopyText}
                >
                  📋 Copy Text
                </button>
              </div>
            </div>
          )}

          {order.humanized_file_url && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>📄 Download Document</h2>
              <div style={styles.actions}>
                <button
                  style={{ ...styles.button, ...styles.downloadBtn }}
                  onClick={handleDownload}
                >
                  ⬇️ Download File
                </button>
              </div>
            </div>
          )}

          {!hasContent && (
            <div style={styles.emptyState}>
              <p>
                Content is being prepared. You'll be notified when it's ready.
              </p>
            </div>
          )}

          {canReview && hasContent && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>✋ Your Review</h2>
              <p style={{ color: "#6b7e85", marginBottom: "1rem" }}>
                Please review the content above. Accept if satisfied, or request
                revisions.
              </p>
              <div style={styles.actions}>
                <button
                  style={{ ...styles.button, ...styles.acceptBtn }}
                  onClick={handleAccept}
                  disabled={submitting}
                >
                  {submitting ? "Accepting..." : "✅ Accept Order"}
                </button>
                <button
                  style={{ ...styles.button, ...styles.revisionBtn }}
                  onClick={handleRequestRevision}
                  disabled={submitting}
                >
                  {submitting ? "Requesting..." : "🔄 Request Revision"}
                </button>
              </div>
            </div>
          )}

          {isCompleted && (
            <div
              style={{
                ...styles.section,
                background: "#e8f5e9",
                padding: "1.5rem",
                borderRadius: "8px",
              }}
            >
              <p
                style={{
                  color: "#27ae60",
                  fontWeight: "600",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                ✅ This order has been completed. Thank you!
              </p>
            </div>
          )}

          <div style={styles.section}>
            <button
              style={{ ...styles.button, ...styles.backBtn }}
              onClick={() => navigate("/my-orders")}
            >
              ← Back to My Orders
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderCompletedPage;
