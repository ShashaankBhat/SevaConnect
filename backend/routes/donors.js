const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Donor } = require("../models");
const { authMiddleware, requireDonor } = require("../middleware/authMiddleware");

// ---------------------
// DONOR REGISTRATION
// ---------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, city, state, pincode, contact, preferences } = req.body;
    if (!name || !email || !password || !contact) {
      return res.status(400).json({ error: "Name, email, password, and contact are required" });
    }

    const existingDonor = await Donor.findOne({ where: { donor_email: email } });
    if (existingDonor) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const donor = await Donor.create({
      donor_name: name,
      donor_email: email,
      donor_password: hashedPassword,
      donor_contact: contact,
      donor_preferences: preferences || null,
      donor_address: address || null,
      donor_city: city || null,
      donor_state: state || null,
      donor_pincode: pincode || null,
    });

    // Generate JWT for 90 days
    const token = jwt.sign(
      { userId: donor.donor_id, email: donor.donor_email, role: "donor" }, // changed `id` -> `userId`
      process.env.JWT_SECRET,
      { expiresIn: "90d" }
    );

    res.status(201).json({
      message: "Donor registered successfully",
      token,
      donor: {
        id: donor.donor_id,
        name: donor.donor_name,
        email: donor.donor_email,
      },
    });
  } catch (err) {
    console.error("Donor Registration Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------
// DONOR LOGIN
// ---------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const donor = await Donor.findOne({ where: { donor_email: email } });
    if (!donor) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, donor.donor_password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT for 90 days
    const token = jwt.sign(
      { userId: donor.donor_id, email: donor.donor_email, role: "donor" }, // changed `id` -> `userId`
      process.env.JWT_SECRET,
      { expiresIn: "90d" }
    );

    res.json({
      message: "Login successful",
      token,
      donor: {
        id: donor.donor_id,
        name: donor.donor_name,
        email: donor.donor_email,
      },
    });
  } catch (err) {
    console.error("Donor Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------
// GET DONOR PROFILE (Protected)
// ---------------------
router.get("/profile", authMiddleware, requireDonor, async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.user.userId, { attributes: { exclude: ["donor_password"] } });
    if (!donor) return res.status(404).json({ error: "Donor not found" });
    res.json({ donor });
  } catch (err) {
    console.error("Fetch Donor Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------
// EDIT DONOR PROFILE (Protected)
// ---------------------
router.put("/profile", authMiddleware, requireDonor, async (req, res) => {
  try {
    const { address, city, state, pincode, preferences } = req.body;
    const donor = await Donor.findByPk(req.user.userId);
    if (!donor) return res.status(404).json({ error: "Donor not found" });

    donor.donor_address = address ?? donor.donor_address;
    donor.donor_city = city ?? donor.donor_city;
    donor.donor_state = state ?? donor.donor_state;
    donor.donor_pincode = pincode ?? donor.donor_pincode;
    donor.donor_preferences = preferences ?? donor.donor_preferences;

    await donor.save();

    res.json({
      message: "Profile updated successfully",
      donor: {
        id: donor.donor_id,
        name: donor.donor_name,
        email: donor.donor_email,
        contact: donor.donor_contact,
        address: donor.donor_address,
        city: donor.donor_city,
        state: donor.donor_state,
        pincode: donor.donor_pincode,
        preferences: donor.donor_preferences,
      },
    });
  } catch (err) {
    console.error("Edit Donor Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;