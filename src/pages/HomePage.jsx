import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";
import { getServices } from "../services/supabase";

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const data = await getServices();
    setServices(data);
    setLoading(false);
  };

  const styles = {
    hero: {
      background: "linear-gradient(135deg, #6B4A8A 0%, #5A3A79 100%)",
      color: "white",
      padding: "5rem 2rem",
      textAlign: "center",
    },
    heroTitle: {
      fontSize: "clamp(2rem, 6vw, 4rem)",
      fontFamily: "Merriweather, serif",
      marginBottom: "1.5rem",
      color: "white",
    },
    heroSubtitle: {
      fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
      maxWidth: "800px",
      margin: "0 auto 2rem",
      lineHeight: "1.6",
      color: "rgba(255,255,255,0.95)",
    },
    heroButton: {
      background: "#50ADB5",
      color: "white",
      border: "none",
      padding: "1rem 2.5rem",
      borderRadius: "30px",
      fontSize: "1.2rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    },
    missionSection: {
      padding: "4rem 2rem",
      maxWidth: "900px",
      margin: "0 auto",
      textAlign: "center",
    },
    missionTitle: {
      fontSize: "clamp(1.5rem, 4vw, 2rem)",
      color: "#5A3A79",
      marginBottom: "2rem",
      fontFamily: "Merriweather, serif",
    },
    missionText: {
      fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
      lineHeight: "1.8",
      color: "#404c50",
      marginBottom: "1rem",
    },
    section: {
      padding: "4rem 2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    sectionTitle: {
      fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
      textAlign: "center",
      marginBottom: "3rem",
      color: "#5A3A79",
    },
    servicesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "2rem",
    },
    guarantees: {
      background: "#F0E8F8",
      padding: "3rem 2rem",
      textAlign: "center",
    },
    guaranteesList: {
      display: "flex",
      justifyContent: "center",
      gap: "3rem",
      flexWrap: "wrap",
      marginTop: "2rem",
    },
    guarantee: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#5A3A79",
    },
    factCheckBanner: {
      background: "linear-gradient(135deg, #50ADB5 0%, #3d8b92 100%)",
      color: "white",
      padding: "2rem",
      textAlign: "center",
      margin: "4rem 0",
    },
    factCheckTitle: {
      fontSize: "1.8rem",
      fontWeight: "700",
      marginBottom: "1rem",
    },
    factCheckText: {
      fontSize: "1.1rem",
      maxWidth: "800px",
      margin: "0 auto",
      lineHeight: "1.6",
    },
    loading: {
      textAlign: "center",
      padding: "4rem 2rem",
      fontSize: "1.2rem",
      color: "#6b7e85",
    },
  };

  return (
    <div>
      <Header />

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Transform AI Text Into Human Writing</h1>
        <p style={styles.heroSubtitle}>
          Professional humanization service with mandatory fact-checking. 0% AI
          detection guaranteed or your money back.
        </p>
        <button style={styles.heroButton} onClick={() => navigate("/order")}>
          Get Started Now
        </button>
      </section>

      <section style={styles.missionSection}>
        <h2 style={styles.missionTitle}>Why Human Eyes Matter</h2>
        <p style={styles.missionText}>
          AI-generated content can miss the mark on facts, tone, and
          authenticity. Human writing carries irreplaceable value through
          nuanced understanding and cultural context.
        </p>
        <p style={styles.missionText}>
          Let professional human editors bridge the gap between AI efficiency
          and genuine human-level quality. Give your content the human touch
          that truly resonates.
        </p>
      </section>

      <div style={styles.factCheckBanner}>
        <div style={styles.factCheckTitle}>
          ✓ Fact-Checking Included in Every Order
        </div>
        <div style={styles.factCheckText}>
          Every piece of content is thoroughly reviewed for factual accuracy,
          proper citations, and logical consistency. We verify claims,
          cross-reference sources, and ensure your content is both authentic and
          accurate.
        </div>
      </div>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Services</h2>

        {loading ? (
          <div style={styles.loading}>Loading services...</div>
        ) : (
          <div style={styles.servicesGrid}>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={{
                  id: service.id,
                  icon: service.icon,
                  title: service.name,
                  description: service.description,
                  pricing: service.pricing_note,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section style={styles.guarantees}>
        <h2 style={styles.sectionTitle}>Our Guarantees</h2>
        <div style={styles.guaranteesList}>
          <div style={styles.guarantee}>✅ 0% AI Detection</div>
          <div style={styles.guarantee}>✅ Mandatory Fact-Checking</div>
          <div style={styles.guarantee}>✅ Meaning Preserved</div>
          <div style={styles.guarantee}>✅ 1 Free Revision</div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
