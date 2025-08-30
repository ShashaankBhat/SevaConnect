// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); // adjust for your model

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    res.json({ message: "User registered successfully!", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password" });

    // create JWT
    const token = jwt.sign({ id: user.id }, "jwtsecretkey", { expiresIn: "1h" });

    res.json({ message: "Login successful!", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;