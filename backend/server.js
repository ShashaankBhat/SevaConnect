require('dotenv').config();
const express = require("express");
const cors = require("cors");

// Import models and utilities
const { 
  sequelize, 
  syncDatabase, 
  Donor, 
  NGO, 
  Requirement, 
  Donation, 
  Admin, 
  Newsletter 
} = require("./models");

// Import routes
const authRoutes = require("./routes/auth");
const donorRoutes = require("./routes/donors");
const ngoRoutes = require("./routes/ngoRoutes");
const donationRoutes = require("./routes/donation"); 
const adminRoutes = require("./routes/adminRoutes"); 
const newsletterRoutes = require("./routes/newsletter");

const app = express();

// ----------------------------
// Middleware
// ----------------------------
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// ----------------------------
// Test route
// ----------------------------
app.get("/", (req, res) => {
  res.json({ success: true, message: "SevaConnect API Running..." });
});

// ----------------------------
// Register routes
// ----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/newsletter", newsletterRoutes);

// ----------------------------
// Database sync
// ----------------------------
(async () => {
  try {
    await syncDatabase(); // Uses your syncDatabase utility with proper logging
    console.log("✅ Database synced successfully, all tables are ready.");
  } catch (err) {
    console.error("❌ Error syncing database:", err);
  }
})();

// ----------------------------
// Start server
// ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));