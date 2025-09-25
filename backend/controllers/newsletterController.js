// controllers/newsletterController.js
const Newsletter = require('../models/Newsletter');

// Subscribe a new email
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Check if already subscribed
    let subscriber = await Newsletter.findByEmail(email);

    if (subscriber) {
      if (subscriber.is_active) {
        return res.status(409).json({
          success: false,
          message: "Email is already subscribed"
        });
      } else {
        // Reactivate subscription
        await subscriber.resubscribe();
        return res.json({
          success: true,
          message: "Subscription reactivated successfully",
          data: subscriber
        });
      }
    }

    // Create new subscription
    subscriber = await Newsletter.create({ email });

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      data: subscriber
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Unsubscribe an email
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const subscriber = await Newsletter.findByEmail(email);

    if (!subscriber || !subscriber.is_active) {
      return res.status(404).json({
        success: false,
        message: "Email not found or already unsubscribed"
      });
    }

    await subscriber.unsubscribe();

    return res.json({
      success: true,
      message: "Unsubscribed successfully"
    });
  } catch (error) {
    console.error("Newsletter unsubscription error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get all active subscribers (admin only)
exports.getActiveSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.getActiveSubscribers();
    return res.json({
      success: true,
      data: subscribers
    });
  } catch (error) {
    console.error("Get active subscribers error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
