// server.js
const express = require("express");
const sequelize = require("./config/db");
const cors = require("cors");  

// ----- MODELS -----
const { Donor, NGO, Donation, Requirement } = require("./models"); 

// ----- ROUTES -----
const donationRoutes = require("./routes/donations");
const authRoutes = require("./routes/auth");
const donorRoutes = require("./routes/donors");
const ngoRoutes = require("./routes/ngoRoutes");

const app = express(); // Initialize Express app

// ----- MIDDLEWARE -----
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON request bodies

// ----- TEST ROUTE -----
app.get("/", (req, res) => {
  res.send("SevaConnect API Running...");
});

// ----- REGISTER ROUTES -----
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/donations", donationRoutes);

// ----- DATABASE SYNC -----
sequelize
  .sync({ alter: true }) // Sync models with DB
  .then(() => console.log("Database synced and all tables created!"))
  .catch((err) => console.error("Error syncing database:", err));

// ----- START SERVER -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));