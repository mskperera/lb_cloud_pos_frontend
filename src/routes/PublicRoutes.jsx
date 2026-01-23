// src/routes/PublicRoutes.jsx
import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/landing";          // adjust path if needed
import PricingPage from "../pages/landing/PricingPage";
import SignUpPage from "../pages/signup";
import { RefundPolicy } from "../components/legal/RefundPolicy";
import { TermsOfService } from "../components/legal/TermsOfService";
import { PrivacyPolicy } from "../components/legal/PrivacyPolicy";
import Navbar from "../pages/landing/Navbar";
import ScrollToHash from "../pages/landing/ScrollToHash";
import CookiePolicy from "../pages/CookiePolicy";

// Optional: a simple layout wrapper just for these pages (Navbar + content)


const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

const PublicRoutes = () => {
  return (
    <Routes>
  
      {/* Landing & marketing pages – no sidebar/topbar */}
      <Route path="/" element={<LandingPage />} />

      {/* Legal & pricing pages – can share same simple layout */}
      <Route
        path="/pricing"
        element={
          <PublicLayout>
            <PricingPage />
          </PublicLayout>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicLayout>
            <SignUpPage />
          </PublicLayout>
        }
      />

      <Route
        path="/terms"
        element={
          <PublicLayout>
            <TermsOfService />
          </PublicLayout>
        }
      />

      <Route
        path="/privacy"
        element={
          <PublicLayout>
            <PrivacyPolicy />
          </PublicLayout>
        }
      />

      <Route
        path="/refund"
        element={
          <PublicLayout>
            <RefundPolicy />
          </PublicLayout>
        }
      />


            <Route
        path="/cookie-policy"
        element={
          <PublicLayout>
            <CookiePolicy />
          </PublicLayout>
        }
      />


      {/* Add more public/marketing routes here in future */}
    </Routes>
  );
};

export default PublicRoutes;