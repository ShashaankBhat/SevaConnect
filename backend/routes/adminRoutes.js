const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Admin } = require("../models");
const { authMiddleware, requireAdmin, requireSuperAdmin } = require("../middleware/authMiddleware");

// ----------------------------
// Test route - accessible by any admin
// ----------------------------
router.get("/", authMiddleware, requireAdmin, (req, res) => {
  res.json({ message: "Admin routes working" });
});

// ----------------------------
// Example: Superadmin-only route
// ----------------------------
router.get("/super", authMiddleware, requireSuperAdmin, (req, res) => {
  res.json({ message: "Superadmin route working" });
});

// ----------------------------
// GET ADMIN PROFILE (Protected)
// ----------------------------
router.get("/profile", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.user.userId, { attributes: { exclude: ["admin_password"] } });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({ admin });
  } catch (err) {
    console.error("Fetch Admin Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// EDIT ADMIN PROFILE (Protected)
// ----------------------------
router.put("/profile", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { name, password, role, status } = req.body;
    const admin = await Admin.findByPk(req.user.userId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (name) admin.admin_name = name;
    if (password) admin.admin_password = await bcrypt.hash(password, 10);
    if (role) admin.admin_role = role;
    if (status) admin.admin_status = status;

    await admin.save();

    res.json({
      message: "Profile updated successfully",
      admin: {
        id: admin.admin_id,
        name: admin.admin_name,
        email: admin.admin_email,
        role: admin.admin_role,
        status: admin.admin_status,
      },
    });
  } catch (err) {
    console.error("Edit Admin Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;