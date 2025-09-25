// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { register, login, getProfile, updateProfile } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

// ----------------------------
// Common Validation Rules
// ----------------------------
const emailValidation = body("email")
  .isEmail()
  .normalizeEmail()
  .withMessage("Please provide a valid email address");
const passwordValidation = body("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number");
const nameValidation = body("name")
  .trim()
  .isLength({ min: 2, max: 100 })
  .withMessage("Name must be between 2 and 100 characters")
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("Name can only contain letters and spaces");
const contactValidation = body("contact")
  .optional()
  .isLength({ min: 10, max: 15 })
  .withMessage("Contact number must be between 10 and 15 characters")
  .matches(/^[0-9+\-\s()]+$/)
  .withMessage("Contact number can only contain numbers, spaces, and +-()");

// ----------------------------
// Register Route
// ----------------------------
router.post(
  "/register",
  [
    body("role")
      .isIn(["donor", "ngo", "admin"])
      .withMessage("Role must be donor, ngo, or admin"),
    nameValidation,
    emailValidation,
    passwordValidation,
    contactValidation,
    // NGO-specific
    body("regNo")
      .if(body("role").equals("ngo"))
      .notEmpty()
      .withMessage("Registration number is required for NGOs")
      .isLength({ min: 5 })
      .withMessage("Registration number must be at least 5 characters"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }
      await register(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// ----------------------------
// Login Route
// ----------------------------
router.post(
  "/login",
  [
    body("role")
      .isIn(["donor", "ngo", "admin"])
      .withMessage("Role must be donor, ngo, or admin"),
    emailValidation,
    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }
      await login(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// ----------------------------
// Profile Route
// ----------------------------
router.get("/profile", authMiddleware, async (req, res, next) => {
  try {
    await getProfile(req, res);
  } catch (error) {
    next(error);
  }
});

// ----------------------------
// Update Profile Route
// ----------------------------
router.put("/:role/:id", authMiddleware, async (req, res, next) => {
  try {
    const { role, id } = req.params;

    // Ensure user can only update their own profile
    if (req.user.role !== role || req.user.id != id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this profile",
      });
    }

    // Role-based validation (frontend already checks, but extra safety)
    if (role === "donor") {
      const { address, city, state, pincode, preferences } = req.body;
      if (!address || !city || !state)
        return res.status(400).json({ success: false, message: "Address, City, and State are required" });
      if (pincode && !/^\d{5,6}$/.test(pincode))
        return res.status(400).json({ success: false, message: "Pincode must be 5 or 6 digits" });
      if (preferences && preferences.length > 500)
        return res.status(400).json({ success: false, message: "Preferences should not exceed 500 characters" });
    } else if (role === "ngo") {
      const { city, state, contact } = req.body;
      if (!city || !state || !contact)
        return res.status(400).json({ success: false, message: "City, State, and Contact are required for NGOs" });
    } else if (role === "admin") {
      const { adminRole } = req.body;
      if (!adminRole)
        return res.status(400).json({ success: false, message: "Admin Role is required" });
    }

    // Call controller
    await updateProfile(req, res);
  } catch (error) {
    next(error);
  }
});

// ----------------------------
// Logout Route
// ----------------------------
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Logout successful. Please remove the token from client storage.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error during logout",
    });
  }
});

// ----------------------------
// Token Verify Route
// ----------------------------
router.get("/verify", authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Token is valid",
      data: { user: req.user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error during token verification",
    });
  }
});

// ----------------------------
// Refresh Token Placeholder
// ----------------------------
router.post("/refresh", (req, res) => {
  res.status(501).json({
    success: false,
    message: "Refresh token endpoint not implemented yet",
  });
});

// ----------------------------
// Error Handling Middleware
// ----------------------------
router.use((error, req, res, next) => {
  console.error("Auth route error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: error.message }),
  });
});

module.exports = router;