const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Donor, NGO, Admin } = require("../models");

// Generate JWT token
const generateToken = (userId, role, email) => {
  return jwt.sign(
    { userId, role, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "90d" }
  );
};

// ----------------------------
// Register controller
// ----------------------------
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, ...additionalData } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role are required"
      });
    }

    if (!["donor", "ngo", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be donor, ngo, or admin"
      });
    }

    const existingDonor = await Donor.findOne({ where: { donor_email: email } });
    const existingNGO = await NGO.findOne({ where: { ngo_email: email } });
    const existingAdmin = await Admin.findOne({ where: { admin_email: email } });

    if (existingDonor || existingNGO || existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    let user, userData;

    switch (role) {
      case "donor":
        user = await Donor.create({
          donor_name: name,
          donor_email: email,
          donor_password: hashedPassword,
          donor_contact: additionalData.contact || null,
          donor_preferences: additionalData.preferences || null,
          donor_address: additionalData.address || null,
          donor_city: additionalData.city || null,
          donor_state: additionalData.state || null,
          donor_pincode: additionalData.pincode || null
        });
        userData = {
          userId: user.donor_id,
          name: user.donor_name,
          email: user.donor_email,
          role: 'donor',
          contact: user.donor_contact,
          address: user.donor_address,
          city: user.donor_city,
          state: user.donor_state,
          pincode: user.donor_pincode,
          preferences: user.donor_preferences
        };
        break;

      case "ngo":
        const regNo = additionalData.regNo || additionalData.ngo_registration_no;
        if (!regNo) {
          return res.status(400).json({ success: false, message: "Registration number is required for NGOs" });
        }
        user = await NGO.create({
          ngo_name: name,
          ngo_email: email,
          ngo_password: hashedPassword,
          ngo_registration_no: regNo,
          ngo_contact: additionalData.contact || "",
          ngo_status: "pending",
          ngo_address: additionalData.address || null,
          ngo_city: additionalData.city || null,
          ngo_state: additionalData.state || null,
          ngo_pincode: additionalData.pincode || null
        });
        userData = {
          userId: user.ngo_id,
          name: user.ngo_name,
          email: user.ngo_email,
          role: 'ngo',
          status: user.ngo_status,
          contact: user.ngo_contact,
          address: user.ngo_address,
          city: user.ngo_city,
          state: user.ngo_state,
          pincode: user.ngo_pincode
        };
        break;

      case "admin":
        user = await Admin.create({
          admin_name: name,
          admin_email: email,
          admin_password: hashedPassword,
          admin_role: additionalData.adminRole || "moderator",
          admin_contact: additionalData.contact || null
        });
        userData = {
          userId: user.admin_id,
          name: user.admin_name,
          email: user.admin_email,
          role: 'admin',
          adminRole: user.admin_role,
          contact: user.admin_contact
        };
        break;
    }

    const token = generateToken(userData.userId, role, userData.email);

    return res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      data: { user: userData, token }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during registration"
    });
  }
};

// ----------------------------
// Login controller
// ----------------------------
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: "Email, password, and role are required" });
    }

    let user, userType;
    switch (role) {
      case "donor":
        user = await Donor.findOne({ where: { donor_email: email } });
        userType = "donor";
        break;
      case "ngo":
        user = await NGO.findOne({ where: { ngo_email: email } });
        userType = "ngo";
        break;
      case "admin":
        user = await Admin.findOne({ where: { admin_email: email } });
        userType = "admin";
        break;
    }

    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const passwordField = userType === 'donor' ? 'donor_password' :
                          userType === 'ngo' ? 'ngo_password' : 'admin_password';

    const isPasswordValid = await bcrypt.compare(password, user[passwordField]);
    if (!isPasswordValid) return res.status(401).json({ success: false, message: "Invalid credentials" });

    let userData;
    if (userType === "donor") {
      userData = {
        userId: user.donor_id,
        name: user.donor_name,
        email: user.donor_email,
        role: 'donor',
        contact: user.donor_contact,
        address: user.donor_address,
        city: user.donor_city,
        state: user.donor_state,
        pincode: user.donor_pincode,
        preferences: user.donor_preferences
      };
    } else if (userType === "ngo") {
      userData = {
        userId: user.ngo_id,
        name: user.ngo_name,
        email: user.ngo_email,
        role: 'ngo',
        status: user.ngo_status,
        contact: user.ngo_contact,
        address: user.ngo_address,
        city: user.ngo_city,
        state: user.ngo_state,
        pincode: user.ngo_pincode
      };
    } else if (userType === "admin") {
      userData = {
        userId: user.admin_id,
        name: user.admin_name,
        email: user.admin_email,
        role: 'admin',
        adminRole: user.admin_role,
        contact: user.admin_contact
      };
    }

    const token = generateToken(userData.userId, userData.role, userData.email);

    return res.json({ success: true, message: "Login successful", data: { user: userData, token } });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error during login" });
  }
};

// ----------------------------
// Get Profile
// ----------------------------
exports.getProfile = async (req, res) => {
  try {
    const { userId, role } = req.user;
    let user;
    switch (role) {
      case "donor":
        user = await Donor.findByPk(userId);
        break;
      case "ngo":
        user = await NGO.findByPk(userId);
        break;
      case "admin":
        user = await Admin.findByPk(userId);
        break;
    }
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, data: { user } });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ----------------------------
// Update Profile
// ----------------------------
exports.updateProfile = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const updates = req.body;
    let user;

    switch (role) {
      case "donor":
        user = await Donor.findByPk(userId);
        if (!user) return res.status(404).json({ success: false, message: "Donor not found" });
        await user.update({
          donor_address: updates.address || user.donor_address,
          donor_city: updates.city || user.donor_city,
          donor_state: updates.state || user.donor_state,
          donor_pincode: updates.pincode || user.donor_pincode,
          donor_preferences: updates.preferences || user.donor_preferences,
          donor_contact: updates.contact || user.donor_contact
        });
        user = {
          userId: user.donor_id,
          name: user.donor_name,
          email: user.donor_email,
          role: 'donor',
          address: user.donor_address,
          city: user.donor_city,
          state: user.donor_state,
          pincode: user.donor_pincode,
          preferences: user.donor_preferences,
          contact: user.donor_contact
        };
        break;

      case "ngo":
        user = await NGO.findByPk(userId);
        if (!user) return res.status(404).json({ success: false, message: "NGO not found" });
        await user.update({
          ngo_address: updates.address || user.ngo_address,
          ngo_city: updates.city || user.ngo_city,
          ngo_state: updates.state || user.ngo_state,
          ngo_pincode: updates.pincode || user.ngo_pincode,
          ngo_contact: updates.contact || user.ngo_contact,
          ngo_status: updates.status || user.ngo_status
        });
        user = {
          userId: user.ngo_id,
          name: user.ngo_name,
          email: user.ngo_email,
          role: 'ngo',
          address: user.ngo_address,
          city: user.ngo_city,
          state: user.ngo_state,
          pincode: user.ngo_pincode,
          status: user.ngo_status,
          contact: user.ngo_contact
        };
        break;

      case "admin":
        user = await Admin.findByPk(userId);
        if (!user) return res.status(404).json({ success: false, message: "Admin not found" });
        await user.update({
          admin_role: updates.adminRole || user.admin_role,
          admin_contact: updates.contact || user.admin_contact
        });
        user = {
          userId: user.admin_id,
          name: user.admin_name,
          email: user.admin_email,
          role: 'admin',
          adminRole: user.admin_role,
          contact: user.admin_contact
        };
        break;
    }

    return res.json({ success: true, message: "Profile updated successfully", data: { user } });

  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: "Internal server error during profile update" });
  }
};  