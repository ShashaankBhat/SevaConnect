// src/pages/DonorHomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
// Components
import HomePageHero from "../components/HomePageHero";
import CTA from "../components/CTA";
import HowItWorks from "../components/HowItWorks";
import NGOProfiles from "../components/NGOProfiles";
import RequirementsShowcase from "../components/RequirementsShowcase";
import DonationOpportunities from "../components/DonationOpportunities";
import Statistics from "../components/Statistics";
import Testimonials from "../components/Testimonials";
import FloatingSubscribe from "../components/FloatingSubscribe";
import NewsletterSignup from "../components/NewsletterSignup";

const DonorHomePage = () => {
  const navigate = useNavigate();

  // Redirect handler for Donate Now button
  const handleDonateNow = () => {
    // Ensure route matches DonateItems page
    navigate("/donor/donate-items");
  };

  return (
    <>
      {/* Homepage Hero */}
      <HomePageHero onDonateNow={handleDonateNow} />

      {/* Show CTA only if user is not logged in */}
      <CTA onDonateNow={handleDonateNow} />

      {/* Other homepage sections */}
      <HowItWorks />

      {/* NGO Profiles Section */}
      <div id="ngos-section">
        <NGOProfiles />
      </div>

      <RequirementsShowcase />
      <DonationOpportunities />
      <Statistics />
      <Testimonials />
      <FloatingSubscribe />
      <NewsletterSignup />
    </>
  );
};

export default DonorHomePage;
