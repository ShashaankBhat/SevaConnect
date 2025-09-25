const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { NGO } = require("../models"); // ensure correct model import
const { authMiddleware, requireNGO } = require("../middleware/authMiddleware");

// ---------------------
// NGO REGISTRATION
// ---------------------
router.post("/register", async (req, res) => {
  console.log("NGO Registration Request Body:", req.body);
  const { name, email, password, regNo, address, contact } = req.body;

  if (!name || !email || !password || !regNo) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    // Check if email or registration number already exists
    const existingNgo = await NGO.findOne({ where: { ngo_email: email } });
    if (existingNgo) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newNgo = await NGO.create({
      ngo_name: name,
      ngo_email: email,
      ngo_password: hashedPassword,
      ngo_registration_no: regNo,
      ngo_address: address || "",
      ngo_contact: contact || "",
    });

    console.log("NGO created:", newNgo.ngo_id);

    // Generate JWT for 90 days
    const token = jwt.sign(
      { userId: newNgo.ngo_id, email: newNgo.ngo_email, role: "ngo" },
      process.env.JWT_SECRET,
      { expiresIn: "90d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      ngo: {
        id: newNgo.ngo_id,
        name: newNgo.ngo_name,
        email: newNgo.ngo_email,
        registrationNo: newNgo.ngo_registration_no,
      },
    });
  } catch (err) {
    console.error("NGO registration error:", err);
    res.status(500).json({ message: "Registration failed. Try again." });
  }
});

// ---------------------
// GET NGO PROFILE (Protected)
// ---------------------
router.get("/profile", authMiddleware, requireNGO, async (req, res) => {
  try {
    const ngo = await NGO.findByPk(req.user.userId, { attributes: { exclude: ["ngo_password"] } });
    if (!ngo) return res.status(404).json({ message: "NGO not found" });
    res.json({ ngo });
  } catch (err) {
    console.error("Fetch NGO Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------
// EDIT NGO PROFILE (Protected)
// ---------------------
router.put("/profile", authMiddleware, requireNGO, async (req, res) => {
  try {
    const { address, contact, name } = req.body;
    const ngo = await NGO.findByPk(req.user.userId);
    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    ngo.ngo_address = address ?? ngo.ngo_address;
    ngo.ngo_contact = contact ?? ngo.ngo_contact;
    ngo.ngo_name = name ?? ngo.ngo_name;

    await ngo.save();

    res.json({
      message: "Profile updated successfully",
      ngo: {
        id: ngo.ngo_id,
        name: ngo.ngo_name,
        email: ngo.ngo_email,
        registrationNo: ngo.ngo_registration_no,
        contact: ngo.ngo_contact,
        address: ngo.ngo_address,
        status: ngo.ngo_status,
      },
    });
  } catch (err) {
    console.error("Edit NGO Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;