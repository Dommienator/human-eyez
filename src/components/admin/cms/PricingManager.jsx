import React, { useState } from "react";

const PricingManager = () => {
  const [pricing, setPricing] = useState({
    academic: {
      "high-school": { price: 35, hours: 48 },
      undergraduate: { price: 50, hours: 48 },
      master: { price: 75, hours: 72 },
      phd: { price: 120, hours: 96 },
    },
    professional: {
      standard: { price: 65, hours: 72 },
    },
    technical: {
      standard: { price: 80, hours: 72 },
    },
    marketing: {
      standard: { price: 45, hours: 48 },
    },
    creative: {
      standard: { price: 40, hours: 48 },
    },
    legal: {
      standard: { price: 95, hours: 96 },
    },
  });

  const [addOns, setAddOns] = useState({
    rushDelivery: 50,
    extraRevision: 25,
    enhancedFactCheck: 50,
  });

  const handlePriceChange = (category, tier, field, value) => {
    setPricing({
      ...pricing,
      [category]: {
        ...pricing[category],
        [tier]: {
          ...pricing[category][tier],
          [field]: parseFloat(value) || 0,
        },
      },
    });
  };

  const handleAddOnChange = (addOn, value) => {
    setAddOns({
      ...addOns,
      [addOn]: parseFloat(value) || 0,
    });
  };

  const handleSave = () => {
    console.log("Saving pricing:", { pricing, addOns });
    alert("Pricing updated successfully!");
  };

  const styles = {
    container: {
      background: "white",
      borderRadius: "12px",
      padding: "2rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    title: {
      fontSize: "2rem",
      color: "#5A3A79",
      fontWeight: "700",
      marginBottom: "2rem",
    },
    section: {
      marginBottom: "3rem",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      color: "#6B4A8A",
      fontWeight: "700",
      marginBottom: "1.5rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "1.5rem",
    },
    card: {
      border: "2px solid #F0E8F8",
      borderRadius: "12px",
      padding: "1.5rem",
      background: "#fafbfc",
    },
    cardTitle: {
      fontSize: "1.2rem",
      fontWeight: "700",
      color: "#5A3A79",
      marginBottom: "1rem",
      textTransform: "capitalize",
    },
    inputGroup: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#6b7e85",
      marginBottom: "0.5rem",
    },
    input: {
      width: "100%",
      padding: "0.8rem",
      fontSize: "1rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
    },
    saveButton: {
      background: "#50ADB5",
      color: "white",
      border: "none",
      padding: "1rem 3rem",
      borderRadius: "30px",
      fontSize: "1.2rem",
      fontWeight: "700",
      cursor: "pointer",
      marginTop: "2rem",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Pricing Management</h2>

      {/* Academic & Research Writing */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Academic & Research Writing</h3>
        <div style={styles.grid}>
          {Object.entries(pricing.academic).map(([tier, data]) => (
            <div key={tier} style={styles.card}>
              <h4 style={styles.cardTitle}>{tier.replace("-", " ")}</h4>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Price per 1000 words ($)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={data.price}
                  onChange={(e) =>
                    handlePriceChange("academic", tier, "price", e.target.value)
                  }
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Turnaround Time (hours)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={data.hours}
                  onChange={(e) =>
                    handlePriceChange("academic", tier, "hours", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional & Business Writing */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Professional & Business Writing</h3>
        <div style={styles.grid}>
          {Object.entries(pricing.professional).map(([tier, data]) => (
            <div key={tier} style={styles.card}>
              <h4 style={styles.cardTitle}>{tier}</h4>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Price per 1000 words ($)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={data.price}
                  onChange={(e) =>
                    handlePriceChange(
                      "professional",
                      tier,
                      "price",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Turnaround Time (hours)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={data.hours}
                  onChange={(e) =>
                    handlePriceChange(
                      "professional",
                      tier,
                      "hours",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical & Scientific Writing */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Technical & Scientific Writing</h3>
        <div style={styles.grid}>
          {Object.entries(pricing.technical).map(([tier, data]) => (
            <div key={tier} style={styles.card}>
              <h4 style={styles.cardTitle}>{tier}</h4>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Price per 1000 words ($)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={data.price}
                  onChange={(e) =>
                    handlePriceChange(
                      "technical",
                      tier,
                      "price",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Turnaround Time (hours)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={data.hours}
                  onChange={(e) =>
                    handlePriceChange(
                      "technical",
                      tier,
                      "hours",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marketing & SEO Content */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Marketing & SEO Content</h3>
        <div style={styles.grid}>
          {Object.entries(pricing.marketing).map(([tier, data]) => (
            <div key={tier} style={styles.card}>
              <h4 style={styles.cardTitle}>{tier}</h4>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Price per 1000 words ($)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={data.price}
                  onChange={(e) =>
                    handlePriceChange(
                      "marketing",
                      tier,
                      "price",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Turnaround Time (hours)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={data.hours}
                  onChange={(e) =>
                    handlePriceChange(
                      "marketing",
                      tier,
                      "hours",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creative & Literary Writing */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Creative & Literary Writing</h3>
        <div style={styles.grid}>
          {Object.entries(pricing.creative).map(([tier, data]) => (
            <div key={tier} style={styles.card}>
              <h4 style={styles.cardTitle}>{tier}</h4>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Price per 1000 words ($)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={data.price}
                  onChange={(e) =>
                    handlePriceChange("creative", tier, "price", e.target.value)
                  }
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Turnaround Time (hours)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={data.hours}
                  onChange={(e) =>
                    handlePriceChange("creative", tier, "hours", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal & Compliance Writing */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Legal & Compliance Writing</h3>
        <div style={styles.grid}>
          {Object.entries(pricing.legal).map(([tier, data]) => (
            <div key={tier} style={styles.card}>
              <h4 style={styles.cardTitle}>{tier}</h4>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Price per 1000 words ($)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={data.price}
                  onChange={(e) =>
                    handlePriceChange("legal", tier, "price", e.target.value)
                  }
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Turnaround Time (hours)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={data.hours}
                  onChange={(e) =>
                    handlePriceChange("legal", tier, "hours", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Add-Ons</h3>
        <div style={styles.grid}>
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Rush Delivery</h4>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Additional Cost (%)</label>
              <input
                type="number"
                style={styles.input}
                value={addOns.rushDelivery}
                onChange={(e) =>
                  handleAddOnChange("rushDelivery", e.target.value)
                }
              />
            </div>
          </div>
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Extra Revision</h4>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Fixed Price ($)</label>
              <input
                type="number"
                style={styles.input}
                value={addOns.extraRevision}
                onChange={(e) =>
                  handleAddOnChange("extraRevision", e.target.value)
                }
              />
            </div>
          </div>
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Enhanced Fact-Check</h4>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Fixed Price ($)</label>
              <input
                type="number"
                style={styles.input}
                value={addOns.enhancedFactCheck}
                onChange={(e) =>
                  handleAddOnChange("enhancedFactCheck", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>

      <button style={styles.saveButton} onClick={handleSave}>
        Save All Changes
      </button>
    </div>
  );
};

export default PricingManager;
