const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Ngo } = require("../models"); // adjust if your model file name is different

// Register NGO
router.post("/register", async (req, res) => {
  console.log("NGO Registration Request Body:", req.body);
  const { name, email, password, regNo, address, contact } = req.body;

  if (!name || !email || !password || !regNo) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    // Check if email or registration number already exists
    const existingNgo = await Ngo.findOne({
      where: { 
        ngo_email: email 
      }
    });

    if (existingNgo) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newNgo = await Ngo.create({
      ngo_name: name,
      ngo_email: email,
      ngo_password: hashedPassword,
      ngo_registration_no: regNo,
      ngo_address: address || "",
      ngo_contact: contact || "",
    });

    console.log("NGO created:", newNgo.ngo_id);
    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    console.error("NGO registration error:", err);
    res.status(500).json({ message: "Registration failed. Try again." });
  }
});

module.exports = router;