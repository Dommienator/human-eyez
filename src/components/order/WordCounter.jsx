import React, { useState } from "react";
import { uploadFile } from "../../services/supabase";

const WordCounter = ({ text, onTextChange, onFileUpload }) => {
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempText, setTempText] = useState("");
  const [manualWordCount, setManualWordCount] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  const countWords = (str) => {
    if (!str || str.trim() === "") return 0;
    return str.trim().split(/\s+/).length;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be under 10MB");
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);

    try {
      if (file.type === "text/plain") {
        const text = await file.text();
        onTextChange(text);

        // Also upload to storage
        const timestamp = Date.now();
        const filePath = `originals/${timestamp}_${file.name}`;
        const fileUrl = await uploadFile(file, "orders", filePath);

        if (onFileUpload) onFileUpload({ file, url: fileUrl });
      } else {
        // Upload non-text files
        const timestamp = Date.now();
        const filePath = `originals/${timestamp}_${file.name}`;
        const fileUrl = await uploadFile(file, "orders", filePath);

        if (onFileUpload) onFileUpload({ file, url: fileUrl });
        setShowManualInput(true);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualWordCountSubmit = () => {
    const count = parseInt(manualWordCount);
    if (isNaN(count) || count <= 0) {
      alert("Please enter a valid word count");
      return;
    }
    onTextChange(`[FILE: ${fileName}] - ${count} words`);
    setShowManualInput(false);
    setManualWordCount("");
  };

  const handleModalDone = () => {
    onTextChange(tempText);
    setShowModal(false);
    setTempText("");
  };

  const wordCount = countWords(text);

  const styles = {
    container: {
      marginBottom: "2rem",
    },
    label: {
      display: "block",
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#5A3A79",
      marginBottom: "0.5rem",
    },
    tabContainer: {
      display: "flex",
      gap: "1rem",
      marginBottom: "1rem",
      borderBottom: "2px solid #ddd",
    },
    tab: {
      background: "none",
      border: "none",
      padding: "0.8rem 1.5rem",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      color: "#6B4A8A",
      borderBottom: "3px solid transparent",
      transition: "all 0.3s",
    },
    activeTab: {
      borderBottom: "3px solid #6B4A8A",
    },
    pasteArea: {
      border: "2px solid #ddd",
      borderRadius: "8px",
      padding: "2rem",
      textAlign: "center",
      cursor: "pointer",
      background: "#fafbfc",
      transition: "all 0.3s",
    },
    pasteIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
    },
    pasteText: {
      fontSize: "1.1rem",
      color: "#5A3A79",
      fontWeight: "600",
    },
    fileUploadArea: {
      border: "2px dashed #6B4A8A",
      borderRadius: "8px",
      padding: "3rem",
      textAlign: "center",
      background: "#F0E8F8",
      cursor: "pointer",
      transition: "all 0.3s",
    },
    fileInput: {
      display: "none",
    },
    uploadIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
    },
    uploadText: {
      fontSize: "1.1rem",
      color: "#5A3A79",
      marginBottom: "0.5rem",
    },
    uploadSubtext: {
      fontSize: "0.9rem",
      color: "#6b7e85",
    },
    fileInfo: {
      marginTop: "1rem",
      padding: "1rem",
      background: "#e8f5e9",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    fileName: {
      fontWeight: "600",
      color: "#2e7d32",
    },
    removeButton: {
      background: "#dc3545",
      color: "white",
      border: "none",
      padding: "0.4rem 1rem",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "0.9rem",
    },
    counter: {
      marginTop: "0.5rem",
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#6B4A8A",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      background: "white",
      borderRadius: "16px",
      width: "90%",
      maxWidth: "1200px",
      maxHeight: "90vh",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    },
    modalHeader: {
      padding: "2rem",
      borderBottom: "2px solid #ddd",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalTitle: {
      fontSize: "1.8rem",
      color: "#5A3A79",
      fontWeight: "700",
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "2rem",
      cursor: "pointer",
      color: "#6b7e85",
    },
    modalBody: {
      padding: "2rem",
      flex: 1,
      overflow: "auto",
    },
    modalTextarea: {
      width: "100%",
      minHeight: "500px",
      padding: "1.5rem",
      fontSize: "1rem",
      fontFamily: "inherit",
      border: "2px solid #ddd",
      borderRadius: "8px",
      resize: "vertical",
      lineHeight: "1.8",
    },
    modalFooter: {
      padding: "2rem",
      borderTop: "2px solid #ddd",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalCounter: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#6B4A8A",
    },
    doneButton: {
      background: "#50ADB5",
      color: "white",
      border: "none",
      padding: "1rem 3rem",
      borderRadius: "30px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
    },
    manualInputOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    manualInputBox: {
      background: "white",
      padding: "3rem",
      borderRadius: "16px",
      maxWidth: "600px",
      width: "90%",
    },
    manualTitle: {
      fontSize: "1.8rem",
      color: "#5A3A79",
      marginBottom: "1rem",
    },
    manualInstructions: {
      fontSize: "1rem",
      color: "#404c50",
      marginBottom: "2rem",
      lineHeight: "1.6",
      background: "#fff9e6",
      padding: "1rem",
      borderRadius: "8px",
      borderLeft: "4px solid #f39c12",
    },
    manualInput: {
      width: "100%",
      padding: "1rem",
      fontSize: "1.2rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
      marginBottom: "1.5rem",
    },
    manualButtons: {
      display: "flex",
      gap: "1rem",
    },
    manualButton: {
      flex: 1,
      padding: "1rem",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      border: "none",
    },
    submitButton: {
      background: "#50ADB5",
      color: "white",
    },
    cancelButton: {
      background: "#6b7e85",
      color: "white",
    },
  };

  const [activeTab, setActiveTab] = useState("paste");

  return (
    <div style={styles.container}>
      <label style={styles.label}>Your AI-Generated Content</label>

      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "paste" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("paste")}
        >
          📝 Paste Text
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "upload" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("upload")}
        >
          📎 Upload File
        </button>
      </div>

      {activeTab === "paste" ? (
        <div>
          {!text ? (
            <div style={styles.pasteArea} onClick={() => setShowModal(true)}>
              <div style={styles.pasteIcon}>📋</div>
              <div style={styles.pasteText}>Click to open text editor</div>
            </div>
          ) : (
            <div style={styles.fileInfo}>
              <span style={styles.fileName}>
                ✓ Text added ({wordCount} words)
              </span>
              <button
                style={styles.removeButton}
                onClick={() => onTextChange("")}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <label htmlFor="file-upload" style={styles.fileUploadArea}>
            <input
              id="file-upload"
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              style={styles.fileInput}
              onChange={handleFileUpload}
            />
            <div style={styles.uploadIcon}>📄</div>
            <div style={styles.uploadText}>
              {isProcessing ? "Processing file..." : "Click to upload"}
            </div>
            <div style={styles.uploadSubtext}>
              Supports: .txt, .pdf, .doc, .docx (Max 10MB)
            </div>
          </label>

          {fileName && !showManualInput && (
            <div style={styles.fileInfo}>
              <span style={styles.fileName}>📄 {fileName}</span>
              <button
                style={styles.removeButton}
                onClick={() => {
                  setFileName("");
                  onTextChange("");
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {text && <div style={styles.counter}>Word Count: {wordCount}</div>}

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Paste Your Content</h2>
              <button
                style={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <textarea
                style={styles.modalTextarea}
                value={tempText}
                onChange={(e) => setTempText(e.target.value)}
                placeholder="Paste your AI-generated text here... You can include formatting, paragraphs, bullet points, etc."
                autoFocus
              />
            </div>
            <div style={styles.modalFooter}>
              <div style={styles.modalCounter}>
                Word Count: {countWords(tempText)}
              </div>
              <button style={styles.doneButton} onClick={handleModalDone}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showManualInput && (
        <div style={styles.manualInputOverlay}>
          <div style={styles.manualInputBox}>
            <h2 style={styles.manualTitle}>Enter Word Count</h2>
            <div style={styles.manualInstructions}>
              <strong>Important:</strong> Please count only the main content
              words. Exclude references, table of contents, cover pages, and
              headers/footers. Accurate word count ensures proper pricing and
              smooth project completion.
            </div>
            <input
              type="number"
              style={styles.manualInput}
              placeholder="Enter word count (e.g., 2500)"
              value={manualWordCount}
              onChange={(e) => setManualWordCount(e.target.value)}
              min="1"
            />
            <div style={styles.manualButtons}>
              <button
                style={{ ...styles.manualButton, ...styles.cancelButton }}
                onClick={() => {
                  setShowManualInput(false);
                  setFileName("");
                  setManualWordCount("");
                }}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.manualButton, ...styles.submitButton }}
                onClick={handleManualWordCountSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordCounter;
