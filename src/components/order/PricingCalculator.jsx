import React from "react";

const PricingCalculator = ({
  service,
  tier,
  wordCount,
  addOns,
  onServiceChange,
  onTierChange,
  onAddOnsChange,
}) => {
  const pricingData = {
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
  };

  const calculatePrice = () => {
    if (!service || !tier || wordCount === 0) return 0;

    const baseRate = pricingData[service]?.[tier]?.price || 0;
    let total = (baseRate / 1000) * wordCount;

    if (addOns.rushDelivery) total *= 1.5;
    if (addOns.extraRevision) total += 25;
    if (addOns.enhancedFactCheck) total += 50;

    return total.toFixed(2);
  };

  const getTurnaroundTime = () => {
    if (!service || !tier) return 0;
    const hours = pricingData[service]?.[tier]?.hours || 0;
    return addOns.rushDelivery ? Math.floor(hours / 2) : hours;
  };

  const styles = {
    container: {
      background: "#F0E8F8",
      padding: "2rem",
      borderRadius: "12px",
      marginBottom: "2rem",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#5A3A79",
      marginBottom: "1.5rem",
    },
    row: {
      marginBottom: "1.5rem",
    },
    label: {
      display: "block",
      fontSize: "1rem",
      fontWeight: "600",
      color: "#5A3A79",
      marginBottom: "0.5rem",
    },
    select: {
      width: "100%",
      padding: "0.8rem",
      fontSize: "1rem",
      border: "2px solid #ddd",
      borderRadius: "8px",
      background: "white",
    },
    checkboxGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.8rem",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      cursor: "pointer",
    },
    checkbox: {
      width: "20px",
      height: "20px",
      cursor: "pointer",
    },
    priceBox: {
      background: "#6B4A8A",
      color: "white",
      padding: "1.5rem",
      borderRadius: "8px",
      marginTop: "2rem",
      textAlign: "center",
    },
    priceLabel: {
      fontSize: "1rem",
      marginBottom: "0.5rem",
    },
    priceAmount: {
      fontSize: "2.5rem",
      fontWeight: "700",
      fontFamily: "Pacifico, cursive",
    },
    turnaround: {
      fontSize: "0.9rem",
      marginTop: "0.5rem",
      opacity: 0.9,
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Pricing Calculator</h3>

      <div style={styles.row}>
        <label style={styles.label}>Service Category</label>
        <select
          style={styles.select}
          value={service}
          onChange={(e) => onServiceChange(e.target.value)}
        >
          <option value="">Select Service</option>
          <option value="academic">Academic & Research Writing</option>
          <option value="professional">Professional & Business Writing</option>
          <option value="technical">Technical & Scientific Writing</option>
          <option value="marketing">Marketing & SEO Content</option>
          <option value="creative">Creative & Literary Writing</option>
          <option value="legal">Legal & Compliance Writing</option>
        </select>
      </div>

      {service && (
        <div style={styles.row}>
          <label style={styles.label}>Service Tier</label>
          <select
            style={styles.select}
            value={tier}
            onChange={(e) => onTierChange(e.target.value)}
          >
            <option value="">Select Tier</option>
            {service === "academic" && (
              <>
                <option value="high-school">
                  High School ($35/1000 words)
                </option>
                <option value="undergraduate">
                  Undergraduate ($50/1000 words)
                </option>
                <option value="master">Master's ($75/1000 words)</option>
                <option value="phd">PhD ($120/1000 words)</option>
              </>
            )}
            {service === "professional" && (
              <option value="standard">Standard ($65/1000 words)</option>
            )}
            {service === "technical" && (
              <option value="standard">Standard ($80/1000 words)</option>
            )}
            {service === "marketing" && (
              <option value="standard">Standard ($45/1000 words)</option>
            )}
            {service === "creative" && (
              <option value="standard">Standard ($40/1000 words)</option>
            )}
            {service === "legal" && (
              <option value="standard">Standard ($95/1000 words)</option>
            )}
          </select>
        </div>
      )}

      <div style={styles.row}>
        <label style={styles.label}>Add-Ons</label>
        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={addOns.rushDelivery}
              onChange={(e) =>
                onAddOnsChange({ ...addOns, rushDelivery: e.target.checked })
              }
            />
            <span>Rush Delivery (+50% of base price)</span>
          </label>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={addOns.extraRevision}
              onChange={(e) =>
                onAddOnsChange({ ...addOns, extraRevision: e.target.checked })
              }
            />
            <span>Extra Revision (+$25)</span>
          </label>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={addOns.enhancedFactCheck}
              onChange={(e) =>
                onAddOnsChange({
                  ...addOns,
                  enhancedFactCheck: e.target.checked,
                })
              }
            />
            <span>Enhanced Fact-Check Report (+$50)</span>
          </label>
        </div>
      </div>

      <div style={styles.priceBox}>
        <div style={styles.priceLabel}>Total Price</div>
        <div style={styles.priceAmount}>${calculatePrice()}</div>
        {getTurnaroundTime() > 0 && (
          <div style={styles.turnaround}>
            Delivery in {getTurnaroundTime()} hours
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCalculator;
