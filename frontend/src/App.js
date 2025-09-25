// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context
import { UserProvider } from "./context/UserContext";

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
import ProtectedRoute from "./components/ProtectedRoute"; // <-- import route guard

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
    <UserProvider>
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

          {/* Donor routes (protected) */}
          <Route
            path="/donor/home"
            element={
              <ProtectedRoute role="donor">
                <Layout>
                  <DonorHomePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/profile"
            element={
              <ProtectedRoute role="donor">
                <Layout>
                  <DonorProfile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/edit-profile"
            element={
              <ProtectedRoute role="donor">
                <Layout>
                  <EditProfile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/donate-items"
            element={
              <ProtectedRoute role="donor">
                <Layout>
                  <DonateItems />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/donation-history"
            element={
              <ProtectedRoute role="donor">
                <Layout>
                  <DonationHistory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/suggested-ngos"
            element={
              <ProtectedRoute role="donor">
                <Layout>
                  <SuggestedNGOs />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute role="donor">
                <Layout>
                  <DonorDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
