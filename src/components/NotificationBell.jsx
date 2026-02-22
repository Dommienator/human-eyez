import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  supabase,
} from "../services/supabase";

const NotificationBell = ({ userEmail }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!userEmail) return;
    loadNotifications();

    // Real-time listener
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_email=eq.${userEmail}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userEmail]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    const data = await getNotifications(userEmail);
    setNotifications(data);
  };

  const handleNotificationClick = async (notification) => {
    await markNotificationRead(notification.id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    );
    setOpen(false);
    if (notification.link) navigate(notification.link);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(userEmail);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case "new_order":
        return "🛍️";
      case "order_update":
        return "🔄";
      case "order_completed":
        return "✅";
      case "payment":
        return "💳";
      default:
        return "🔔";
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const styles = {
    wrapper: { position: "relative" },
    bellButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      position: "relative",
      padding: "0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    bellIcon: { fontSize: "1.5rem" },
    badge: {
      position: "absolute",
      top: "0",
      right: "0",
      background: "#e74c3c",
      color: "white",
      borderRadius: "50%",
      width: "18px",
      height: "18px",
      fontSize: "0.7rem",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    dropdown: {
      position: "absolute",
      top: "100%",
      right: "0",
      width: "360px",
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
      zIndex: 9999,
      overflow: "hidden",
      marginTop: "0.5rem",
    },
    dropdownHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 1.2rem",
      borderBottom: "1px solid #f0f0f0",
      background: "#F0E8F8",
    },
    dropdownTitle: {
      fontWeight: "700",
      color: "#5A3A79",
      fontSize: "1rem",
    },
    markAllBtn: {
      background: "none",
      border: "none",
      color: "#6B4A8A",
      cursor: "pointer",
      fontSize: "0.85rem",
      fontWeight: "600",
    },
    notificationList: {
      maxHeight: "380px",
      overflowY: "auto",
    },
    notificationItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "0.8rem",
      padding: "1rem 1.2rem",
      cursor: "pointer",
      borderBottom: "1px solid #f9f9f9",
      transition: "background 0.2s",
    },
    notificationIcon: { fontSize: "1.5rem", marginTop: "0.1rem" },
    notificationBody: { flex: 1 },
    notificationTitle: {
      fontWeight: "600",
      color: "#404c50",
      fontSize: "0.9rem",
      marginBottom: "0.2rem",
    },
    notificationMessage: {
      color: "#6b7e85",
      fontSize: "0.85rem",
      lineHeight: "1.4",
    },
    notificationTime: {
      color: "#aaa",
      fontSize: "0.75rem",
      marginTop: "0.3rem",
    },
    unreadDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: "#6B4A8A",
      marginTop: "0.4rem",
      flexShrink: 0,
    },
    emptyState: {
      padding: "2rem",
      textAlign: "center",
      color: "#6b7e85",
    },
    emptyIcon: { fontSize: "2.5rem", marginBottom: "0.5rem" },
  };

  return (
    <div style={styles.wrapper} ref={dropdownRef}>
      <button style={styles.bellButton} onClick={() => setOpen(!open)}>
        <span style={styles.bellIcon}>🔔</span>
        {unreadCount > 0 && (
          <span style={styles.badge}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <span style={styles.dropdownTitle}>
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </span>
            {unreadCount > 0 && (
              <button style={styles.markAllBtn} onClick={handleMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div style={styles.notificationList}>
            {notifications.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🔔</div>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    ...styles.notificationItem,
                    background: notification.read ? "white" : "#faf6ff",
                  }}
                  onClick={() => handleNotificationClick(notification)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = notification.read
                      ? "white"
                      : "#faf6ff")
                  }
                >
                  <span style={styles.notificationIcon}>
                    {getIcon(notification.type)}
                  </span>
                  <div style={styles.notificationBody}>
                    <div style={styles.notificationTitle}>
                      {notification.title}
                    </div>
                    <div style={styles.notificationMessage}>
                      {notification.message}
                    </div>
                    <div style={styles.notificationTime}>
                      {timeAgo(notification.created_at)}
                    </div>
                  </div>
                  {!notification.read && <div style={styles.unreadDot} />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
