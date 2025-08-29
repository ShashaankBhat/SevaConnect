// src/pages/HomePage.js
import React from "react";

// Components
import HomePageHero from "../components/HomePageHero";
import CTA from "../components/CTA";
import HowItWorks from "../components/HowItWorks";
import NGOProfiles from "../components/NGOProfiles";
import RequirementsShowcase from "../components/RequirementsShowcase";
import DonationOpportunities from "../components/DonationOpportunities";
import Statistics from "../components/Statistics";
import Testimonials from "../components/Testimonials";
// In src/pages/HomePage.js
import FloatingSubscribe from "../components/FloatingSubscribe";
import NewsletterSignup from "../components/NewsletterSignup";

const HomePage = () => {
  return (
    <>
      <HomePageHero />
      <CTA />
      <HowItWorks />
      <NGOProfiles />
      <RequirementsShowcase />
      <DonationOpportunities />
      <Statistics />
      <Testimonials />
      <FloatingSubscribe />
      <NewsletterSignup />
    </>
  );
};

export default HomePage;
