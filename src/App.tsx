import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Hero } from "./components/Hero";
import { ToolGrid } from "./components/ToolGrid";
import { Converter } from "./components/Converter";
import { AboutSection } from "./components/AboutSection";
import { ContactModal } from "./components/ContactModal";
import { FeedbackModal } from "./components/FeedbackModal";
import { ToolType } from "./types";
import { logPageView } from "./services/analytics";
import {
  softwareAppJsonLd,
  organizationJsonLd,
  websiteJsonLd
} from "./seo/jsonLd";
import { useJsonLd } from "./hooks/useJsonLd";

/* ---------------- Scroll to top on route change ---------------- */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

import { AboutPage } from "./components/policies/AboutPage";
import { PrivacyPolicyPage } from "./components/policies/PrivacyPolicyPage";
import { TermsPage } from "./components/policies/TermsPage";
import { CookiesPage } from "./components/policies/CookiesPage";
import { AccessibilityPage } from "./components/policies/AccessibilityPage";
import { SecurePage } from "./components/policies/SecurePage";
import { FaqPage } from "./components/policies/FaqPage";

const App: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<ToolType | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    logPageView(window.location.pathname, document.title);
  }, []);

  useJsonLd({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GenPDF",
  "url": "https://genpdf.io",
  "logo": "https://genpdf.io/og-image.png",
  "description":
    "GenPDF is a secure, AI-powered PDF conversion and document processing platform offering OCR, text extraction, and intelligent PDF tools.",
  "foundingDate": "2024",
  "sameAs": [
    "https://twitter.com/genpdf",
    "https://www.linkedin.com/company/genpdf"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@genpdf.io"
  }
});

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(softwareAppJsonLd)}
      </script>

      <script type="application/ld+json">
        {JSON.stringify(organizationJsonLd)}
      </script>

      <script type="application/ld+json">
        {JSON.stringify(websiteJsonLd)}
      </script>
      
      <ScrollToTop />

      <Layout
        onLogoClick={() => setCurrentTool(null)}
        onContactClick={() => setShowContact(true)}
        onFeedbackClick={() => setShowFeedback(true)}
      >
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              !currentTool ? (
                <>
                  <Hero />
                  <ToolGrid
                    onSelectTool={(tool) => {
                      setCurrentTool(tool);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                  <AboutSection />
                </>
              ) : (
                <Converter
                  toolType={currentTool}
                  onBack={() => {
                    setCurrentTool(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              )
            }
          />

          {/* POLICY PAGES */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/secure" element={<SecurePage />} />
            <Route path="/faq" element={<FaqPage />} />
        </Routes>

        <ContactModal
          isOpen={showContact}
          onClose={() => setShowContact(false)}
        />

        <FeedbackModal
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
        />
      </Layout>
    </>
  );
};

export default App;
