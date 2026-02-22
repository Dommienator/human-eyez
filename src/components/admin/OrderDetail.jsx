import React, { useState } from "react";
import {
  supabase,
  uploadHumanizedContent,
  createNotification,
} from "../../services/supabase";

const OrderDetail = ({ order, onClose, onUpdate }) => {
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.admin_notes || "");
  const [humanizedText, setHumanizedText] = useState(
    order.humanized_text || "",
  );
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileUrl = await uploadHumanizedContent(file, order.order_number);

    if (fileUrl) {
      setUploadedFile({ name: file.name, url: fileUrl });
      alert("File uploaded successfully!");
    } else {
      alert("File upload failed");
    }
    setUploading(false);
  };

  const handleSubmitToClient = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!humanizedText && !uploadedFile && !order.humanized_file_url) {
      alert(
        "Please add humanized content (text or file) before submitting to client",
      );
      return;
    }

    setSaving(true);

    const updates = {
      status: "ready-for-review",
      admin_notes: notes,
      humanized_text: humanizedText || null,
      humanized_file_url: uploadedFile?.url || order.humanized_file_url || null,
    };

    console.log("💾 Saving to database:", updates);
    console.log("📝 Text length:", humanizedText?.length || 0);
    console.log("📄 File URL:", updates.humanized_file_url);

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", order.id)
      .select();

    if (error) {
      console.error("❌ Database save failed:", error);
      alert("Failed to submit: " + error.message);
      setSaving(false);
      return;
    }

    console.log("✅ Saved to database successfully:", data);

    // Notify customer
    try {
      await createNotification(
        order.customer_email,
        "order_completed",
        "Your Order is Ready for Review! ✅",
        `Order #${order.order_number} is ready. Click to view and download.`,
        `/order-completed/${order.order_number}`,
      );
      console.log("🔔 Customer notified");
    } catch (error) {
      console.error("❌ Notification failed:", error);
    }

    alert("✅ Content submitted to client! They have been notified.");
    onUpdate({ ...order, ...updates });
    setSaving(false);
    onClose();
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "2rem",
    },
    modal: {
      background: "white",
      borderRadius: "16px",
      maxWidth: "900px",
      width: "100%",
      maxHeight: "90vh",
      overflow: "auto",
      padding: "2rem",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      paddingBottom: "1rem",
      borderBottom: "2px solid #f0f0f0",
    },
    title: {
      fontSize: "1.8rem",
      color: "#5A3A79",
      fontWeight: "700",
    },
    closeBtn: {
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#6b7e85",
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
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      background: "#F0E8F8",
      padding: "1.5rem",
      borderRadius: "8px",
    },
    infoItem: {
      display: "flex",
      flexDirection: "column",
      gap: "0.3rem",
    },
    label: {
      fontSize: "0.85rem",
      color: "#6b7e85",
      fontWeight: "600",
      textTransform: "uppercase",
    },
    value: {
      fontSize: "1rem",
      color: "#404c50",
      fontWeight: "600",
    },
    textarea: {
      padding: "1rem",
      fontSize: "1rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
      width: "100%",
      minHeight: "150px",
      fontFamily: "inherit",
      resize: "vertical",
    },
    textEditor: {
      padding: "1rem",
      fontSize: "1rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
      width: "100%",
      minHeight: "300px",
      fontFamily: "monospace",
      resize: "vertical",
    },
    fileUploadArea: {
      border: "2px dashed #6B4A8A",
      borderRadius: "8px",
      padding: "2rem",
      textAlign: "center",
      background: "#fafafa",
    },
    fileInput: {
      display: "none",
    },
    uploadBtn: {
      background: "#6B4A8A",
      color: "white",
      border: "none",
      padding: "0.8rem 1.5rem",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      marginTop: "1rem",
    },
    uploadedFile: {
      background: "#e8f5e9",
      padding: "1rem",
      borderRadius: "8px",
      marginTop: "1rem",
    },
    actions: {
      display: "flex",
      gap: "1rem",
      marginTop: "2rem",
      paddingTop: "2rem",
      borderTop: "2px solid #f0f0f0",
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
    },
    submitBtn: {
      background: "#27ae60",
      color: "white",
    },
    cancelBtn: {
      background: "#e0e0e0",
      color: "#404c50",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Order #{order.order_number}</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Order Information</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.label}>Customer</span>
              <span style={styles.value}>{order.customer_email}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>Service</span>
              <span style={styles.value}>{order.service_category}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>Words</span>
              <span style={styles.value}>{order.word_count}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>Price</span>
              <span style={styles.value}>${order.total_price}</span>
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
          <h3 style={styles.sectionTitle}>📝 Add Humanized Content (Text)</h3>
          <textarea
            style={styles.textEditor}
            value={humanizedText}
            onChange={(e) => setHumanizedText(e.target.value)}
            placeholder="Type or paste the humanized content here..."
          />
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📄 OR Upload Humanized File</h3>
          <div style={styles.fileUploadArea}>
            <p>Upload .docx, .pdf, or .txt file</p>
            <input
              type="file"
              id="fileUpload"
              style={styles.fileInput}
              onChange={handleFileUpload}
              accept=".docx,.pdf,.txt"
            />
            <button
              style={styles.uploadBtn}
              onClick={() => document.getElementById("fileUpload").click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Choose File"}
            </button>
          </div>
          {(uploadedFile || order.humanized_file_url) && (
            <div style={styles.uploadedFile}>
              ✅ {uploadedFile?.name || "File uploaded"}
            </div>
          )}
        </div>

        <div style={styles.actions}>
          <button
            style={{ ...styles.button, ...styles.submitBtn }}
            onClick={handleSubmitToClient}
            disabled={saving}
          >
            {saving ? "Submitting..." : "✅ Submit to Client"}
          </button>
          <button
            style={{ ...styles.button, ...styles.cancelBtn }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
