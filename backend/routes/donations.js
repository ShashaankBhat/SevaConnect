// backend/routes/donations.js
const express = require("express");
const router = express.Router();
const { Donation, Donor, NGO, Requirement } = require("../models");

// GET all donations with associated Donor, NGO, and Requirement
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.findAll({
      include: [Donor, NGO, Requirement],
      limit: 50,
    });
    res.json(donations);
  } catch (err) {
    console.error("Error fetching donations:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create a new donation
router.post("/", async (req, res) => {
  try {
    const { donorId, ngoId, requirement_id, donated_item, donated_quantity, pickup_or_drop } = req.body;

    // Validate donor, NGO, and requirement exist
    const donor = await Donor.findByPk(donorId);
    const ngo = await NGO.findByPk(ngoId);
    const requirement = await Requirement.findByPk(requirement_id);

    if (!donor || !ngo || !requirement) {
      return res.status(400).json({ error: "Invalid donor, NGO, or requirement ID" });
    }

    const newDonation = await Donation.create({
      donorId,
      ngoId,
      requirement_id,
      donated_item,
      donated_quantity,
      pickup_or_drop,
    });

    res.status(201).json(newDonation);
  } catch (err) {
    console.error("Error creating donation:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
