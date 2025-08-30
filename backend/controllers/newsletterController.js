const db = require("../models");
const Newsletter = db.Newsletter;

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // check if already exists
    const existing = await Newsletter.findOne({ where: { email } });
    if (existing) {
      return res.status(200).json({ message: "Already subscribed" });
    }

    const subscription = await Newsletter.create({ email });
    res.status(201).json({ message: "Subscribed successfully", subscription });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
