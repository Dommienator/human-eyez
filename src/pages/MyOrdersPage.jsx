import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCurrentUser, getOrdersByCustomer } from "../services/supabase";

const MyOrdersPage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadOrders();
  }, []);

  const checkAuthAndLoadOrders = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    const userOrders = await getOrdersByCustomer(currentUser.email);
    setOrders(userOrders);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f39c12",
      "in-progress": "#3498db",
      completed: "#27ae60",
      delivered: "#8FB569",
    };
    return colors[status] || "#6b7e85";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      "in-progress": "🔄",
      completed: "✅",
      delivered: "📥",
    };
    return icons[status] || "📋";
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    inProgress: orders.filter((o) => o.status === "in-progress").length,
    completed: orders.filter(
      (o) => o.status === "completed" || o.status === "delivered",
    ).length,
  };

  const styles = {
    page: { minHeight: "100vh", display: "flex", flexDirection: "column" },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "3rem 2rem",
      flexGrow: 1,
    },
    title: {
      fontSize: "clamp(2rem, 5vw, 3rem)",
      color: "#5A3A79",
      marginBottom: "0.5rem",
    },
    subtitle: { fontSize: "1.1rem", color: "#6b7e85", marginBottom: "3rem" },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1.5rem",
      marginBottom: "3rem",
    },
    statCard: {
      background: "#F0E8F8",
      padding: "1.5rem",
      borderRadius: "12px",
      textAlign: "center",
    },
    statNumber: { fontSize: "2.5rem", fontWeight: "700", color: "#6B4A8A" },
    statLabel: { fontSize: "0.9rem", color: "#6b7e85", marginTop: "0.5rem" },
    ordersGrid: { display: "grid", gap: "1.5rem" },
    orderCard: {
      background: "white",
      borderRadius: "12px",
      padding: "2rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      transition: "all 0.3s",
    },
    orderHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
      paddingBottom: "1rem",
      borderBottom: "2px solid #f0f0f0",
    },
    orderNumber: { fontSize: "1.3rem", fontWeight: "700", color: "#5A3A79" },
    statusBadge: {
      padding: "0.5rem 1.2rem",
      borderRadius: "20px",
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "white",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    orderDetails: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    detailItem: { display: "flex", flexDirection: "column", gap: "0.3rem" },
    detailLabel: {
      fontSize: "0.85rem",
      color: "#6b7e85",
      fontWeight: "600",
      textTransform: "uppercase",
    },
    detailValue: { fontSize: "1rem", color: "#404c50", fontWeight: "600" },
    orderActions: { display: "flex", gap: "1rem", marginTop: "1rem" },
    button: {
      padding: "0.7rem 1.5rem",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      border: "none",
      transition: "all 0.3s",
    },
    viewButton: { background: "#6B4A8A", color: "white" },
    downloadButton: { background: "#50ADB5", color: "white" },
    disabledButton: {
      background: "#ccc",
      color: "#888",
      cursor: "not-allowed",
    },
    emptyState: {
      textAlign: "center",
      padding: "5rem 2rem",
      background: "white",
      borderRadius: "12px",
    },
    emptyIcon: { fontSize: "5rem", marginBottom: "1rem" },
    emptyTitle: { fontSize: "1.8rem", color: "#5A3A79", marginBottom: "1rem" },
    emptyText: { fontSize: "1.1rem", color: "#6b7e85", marginBottom: "2rem" },
    startButton: {
      background: "#50ADB5",
      color: "white",
      border: "none",
      padding: "1rem 2rem",
      borderRadius: "30px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
    },
    loading: {
      textAlign: "center",
      padding: "5rem 2rem",
      fontSize: "1.2rem",
      color: "#6b7e85",
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.container}>
          <div style={styles.loading}>Loading your orders...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>My Orders</h1>
        <p style={styles.subtitle}>
          Welcome back, {user?.user_metadata?.full_name || user?.email}
        </p>

        {orders.length > 0 && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{stats.total}</div>
              <div style={styles.statLabel}>Total Orders</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{stats.pending}</div>
              <div style={styles.statLabel}>Pending</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{stats.inProgress}</div>
              <div style={styles.statLabel}>In Progress</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{stats.completed}</div>
              <div style={styles.statLabel}>Completed</div>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <h2 style={styles.emptyTitle}>No Orders Yet</h2>
            <p style={styles.emptyText}>
              You haven't placed any orders yet. Start by humanizing your AI
              content!
            </p>
            <button
              style={styles.startButton}
              onClick={() => navigate("/order")}
            >
              Place Your First Order
            </button>
          </div>
        ) : (
          <div style={styles.ordersGrid}>
            {orders.map((order) => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div style={styles.orderNumber}>#{order.order_number}</div>
                  <span
                    style={{
                      ...styles.statusBadge,
                      background: getStatusColor(order.status),
                    }}
                  >
                    {getStatusIcon(order.status)} {order.status}
                  </span>
                </div>
                <div style={styles.orderDetails}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Service</span>
                    <span style={styles.detailValue}>
                      {order.service_category}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Tier</span>
                    <span style={styles.detailValue}>{order.service_tier}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Words</span>
                    <span style={styles.detailValue}>{order.word_count}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Total</span>
                    <span style={styles.detailValue}>${order.total_price}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Date</span>
                    <span style={styles.detailValue}>
                      {new Date(order.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={styles.orderActions}>
                  <button
                    style={{ ...styles.button, ...styles.viewButton }}
                    onClick={() => {
                      if (
                        order.status === "completed" ||
                        order.status === "delivered"
                      ) {
                        // Show completed order details
                        navigate(`/order-completed/${order.order_number}`);
                      } else {
                        // Show tracking
                        navigate(`/track?order=${order.order_number}`);
                      }
                    }}
                  >
                    {order.status === "completed" ||
                    order.status === "delivered"
                      ? "View & Download"
                      : "View Details"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyOrdersPage;
