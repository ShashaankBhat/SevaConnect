const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Donor } = require('../models'); // use index.js export for Sequelize models

// Donor Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, address, contact, preferences } = req.body;

    // Check if donor already exists
    const existingDonor = await Donor.findOne({ where: { donor_email: email } });
    if (existingDonor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create donor in MySQL
    const donor = await Donor.create({
      donor_name: name,
      donor_email: email,
      donor_password: hashedPassword,
      donor_address: address,
      donor_phone: contact,
      donor_preferences: preferences || null, // optional field
    });

    // Respond without sending password
    res.status(201).json({
      message: 'Donor registered successfully',
      donor: {
        id: donor.id,
        name: donor.donor_name,
        email: donor.donor_email,
      },
    });
  } catch (err) {
    console.error('Donor Registration Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;