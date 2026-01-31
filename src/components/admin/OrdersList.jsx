import React, { useState, useEffect } from "react";
import OrderDetail from "./OrderDetail";
import { getAllOrders, updateOrderStatus } from "../../services/supabase";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleUpdateOrder = async (updatedOrder) => {
    await updateOrderStatus(
      updatedOrder.id,
      updatedOrder.status,
      updatedOrder.admin_notes,
    );
    await loadOrders();
    setSelectedOrder(null);
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

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    inProgress: orders.filter((o) => o.status === "in-progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  const styles = {
    container: {
      background: "white",
      borderRadius: "12px",
      padding: "2rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "1.5rem",
      marginBottom: "2rem",
    },
    statCard: {
      background: "#F0E8F8",
      padding: "1.5rem",
      borderRadius: "12px",
      textAlign: "center",
    },
    statNumber: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#6B4A8A",
    },
    statLabel: {
      fontSize: "0.9rem",
      color: "#6b7e85",
      marginTop: "0.5rem",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
    },
    title: {
      fontSize: "2rem",
      color: "#5A3A79",
      fontWeight: "700",
    },
    filters: {
      display: "flex",
      gap: "1rem",
    },
    filterButton: {
      padding: "0.6rem 1.2rem",
      border: "2px solid #6B4A8A",
      background: "transparent",
      color: "#6B4A8A",
      borderRadius: "20px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s",
    },
    activeFilter: {
      background: "#6B4A8A",
      color: "white",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      background: "#F0E8F8",
      padding: "1rem",
      textAlign: "left",
      fontWeight: "700",
      color: "#5A3A79",
      borderBottom: "2px solid #ddd",
    },
    td: {
      padding: "1rem",
      borderBottom: "1px solid #f0f0f0",
    },
    statusBadge: {
      padding: "0.4rem 1rem",
      borderRadius: "20px",
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "white",
      display: "inline-block",
      textTransform: "capitalize",
    },
    viewButton: {
      background: "#50ADB5",
      color: "white",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
    },
    emptyState: {
      textAlign: "center",
      padding: "4rem",
      color: "#6b7e85",
    },
    loading: {
      textAlign: "center",
      padding: "4rem",
      fontSize: "1.2rem",
      color: "#6b7e85",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading orders...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Stats Overview */}
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

      <div style={styles.header}>
        <h2 style={styles.title}>Orders ({filteredOrders.length})</h2>

        <div style={styles.filters}>
          <button
            style={{
              ...styles.filterButton,
              ...(filter === "all" ? styles.activeFilter : {}),
            }}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            style={{
              ...styles.filterButton,
              ...(filter === "pending" ? styles.activeFilter : {}),
            }}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            style={{
              ...styles.filterButton,
              ...(filter === "in-progress" ? styles.activeFilter : {}),
            }}
            onClick={() => setFilter("in-progress")}
          >
            In Progress
          </button>
          <button
            style={{
              ...styles.filterButton,
              ...(filter === "completed" ? styles.activeFilter : {}),
            }}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No orders found</h3>
          <p>Orders will appear here once customers start placing them.</p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order #</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Service</th>
              <th style={styles.th}>Words</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td style={styles.td}>{order.order_number}</td>
                <td style={styles.td}>{order.customer_email}</td>
                <td style={styles.td}>
                  {order.service_category} - {order.service_tier}
                </td>
                <td style={styles.td}>{order.word_count}</td>
                <td style={styles.td}>${order.total_price}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      background: getStatusColor(order.status),
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td style={styles.td}>
                  {new Date(order.submitted_at).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.viewButton}
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleUpdateOrder}
        />
      )}
    </div>
  );
};

export default OrdersList;
