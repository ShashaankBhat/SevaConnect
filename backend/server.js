const express = require("express");
const sequelize = require("./config/database");

// Import Models (and their relationships from index.js)
const { Donor, NGO, Donation, Requirement } = require("./models"); 
const donationRoutes = require("./routes/donations"); // only once

const app = express();
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("SevaConnect API Running...");
});

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);


// Donation Routes
app.use("/api/donations", donationRoutes);

// Sync DB with all models
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced and all tables created!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
