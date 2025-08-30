// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DonateItems from "./pages/DonateItems";

// Donor pages
import DonorHomePage from "./pages/DonorHomePage";
import DonorProfile from "./pages/DonorProfile";
import EditProfile from "./pages/EditProfile";
import DonationHistory from "./pages/DonationHistory";
import SuggestedNGOs from "./pages/SuggestedNGOs";
import DonorDashboard from "./pages/DonorDashboard";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Layout wrapper for all pages
const Layout = ({ children }) => {
  const hideNavbar = ["/login", "/register"].includes(window.location.pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/donate"
          element={
            <Layout>
              <DonateItems />
            </Layout>
          }
        />

        {/* Donor routes */}
        <Route
          path="/donor/home"
          element={
            <Layout>
              <DonorHomePage />
            </Layout>
          }
        />
        <Route
          path="/donor/profile"
          element={
            <Layout>
              <DonorProfile />
            </Layout>
          }
        />
        <Route
          path="/donor/edit-profile"
          element={
            <Layout>
              <EditProfile />
            </Layout>
          }
        />
        <Route
          path="/donor/donate-items"
          element={
            <Layout>
              <DonateItems />
            </Layout>
          }
        />
        <Route
          path="/donor/donation-history"
          element={
            <Layout>
              <DonationHistory />
            </Layout>
          }
        />
        <Route
          path="/donor/suggested-ngos"
          element={
            <Layout>
              <SuggestedNGOs />
            </Layout>
          }
        />
        <Route
          path="/donor/dashboard"
          element={
            <Layout>
              <DonorDashboard />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;