import React, { useState } from "react";

const OrderDetail = ({ order, onClose, onUpdate }) => {
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.admin_notes || "");
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleStatusUpdate = async () => {
    await onUpdate({
      ...order,
      status,
      admin_notes: notes,
    });

    console.log("Order updated:", order.order_number);
    alert("Order updated successfully!");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      alert("File ready: " + file.name);
    }
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 3000,
      overflowY: "auto",
      padding: "2rem 0",
    },
    modal: {
      background: "white",
      borderRadius: "16px",
      width: "90%",
      maxWidth: "1000px",
      maxHeight: "90vh",
      overflow: "auto",
      margin: "auto",
    },
    header: {
      background: "#6B4A8A",
      color: "white",
      padding: "2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "16px 16px 0 0",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "700",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: "white",
      fontSize: "2rem",
      cursor: "pointer",
    },
    body: {
      padding: "2rem",
    },
    section: {
      marginBottom: "2rem",
    },
    sectionTitle: {
      fontSize: "1.3rem",
      fontWeight: "700",
      color: "#5A3A79",
      marginBottom: "1rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
    },
    field: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      fontWeight: "600",
      color: "#6b7e85",
      marginBottom: "0.5rem",
      fontSize: "0.9rem",
    },
    value: {
      color: "#404c50",
      fontSize: "1.1rem",
    },
    textarea: {
      width: "100%",
      minHeight: "200px",
      padding: "1rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      resize: "vertical",
    },
    select: {
      width: "100%",
      padding: "0.8rem",
      fontSize: "1rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
    },
    uploadArea: {
      border: "2px dashed #6B4A8A",
      borderRadius: "8px",
      padding: "2rem",
      textAlign: "center",
      cursor: "pointer",
      background: "#F0E8F8",
    },
    fileInput: {
      display: "none",
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem",
      marginTop: "2rem",
    },
    button: {
      flex: 1,
      padding: "1rem",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
      border: "none",
      transition: "all 0.3s",
    },
    saveButton: {
      background: "#50ADB5",
      color: "white",
    },
    cancelButton: {
      background: "#6b7e85",
      color: "white",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Order #{order.order_number}</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Order Information</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <span style={styles.label}>Customer Email</span>
                <div style={styles.value}>{order.customer_email}</div>
              </div>
              <div style={styles.field}>
                <span style={styles.label}>Order Date</span>
                <div style={styles.value}>
                  {new Date(order.submitted_at).toLocaleString()}
                </div>
              </div>
              <div style={styles.field}>
                <span style={styles.label}>Service</span>
                <div style={styles.value}>{order.service_category}</div>
              </div>
              <div style={styles.field}>
                <span style={styles.label}>Tier</span>
                <div style={styles.value}>{order.service_tier}</div>
              </div>
              <div style={styles.field}>
                <span style={styles.label}>Word Count</span>
                <div style={styles.value}>{order.word_count} words</div>
              </div>
              <div style={styles.field}>
                <span style={styles.label}>Total Price</span>
                <div style={styles.value}>${order.total_price}</div>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Original Content</h3>
            <textarea
              style={styles.textarea}
              value={order.original_text || "File uploaded"}
              readOnly
            />
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Update Status</h3>
            <div style={styles.field}>
              <label style={styles.label}>Order Status</label>
              <select
                style={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Upload Humanized Content</h3>
            <label htmlFor="humanized-upload" style={styles.uploadArea}>
              <input
                id="humanized-upload"
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                style={styles.fileInput}
                onChange={handleFileUpload}
              />
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📤</div>
              <div style={{ fontWeight: "600", color: "#5A3A79" }}>
                {uploadedFile
                  ? "File: " + uploadedFile.name
                  : "Click to upload"}
              </div>
            </label>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Admin Notes</h3>
            <textarea
              style={styles.textarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes..."
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              style={{ ...styles.button, ...styles.saveButton }}
              onClick={handleStatusUpdate}
            >
              Save Changes
            </button>
            <button
              style={{ ...styles.button, ...styles.cancelButton }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
